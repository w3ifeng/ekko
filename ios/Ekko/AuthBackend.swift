import AuthenticationServices
import Combine
import CryptoKit
import Foundation
import Security

struct EkkoSession: Codable {
    let accessToken: String
    let refreshToken: String
    let expiresAt: Date
    let user: AuthUser

    var isExpired: Bool { expiresAt.timeIntervalSinceNow < 60 }
}

struct AuthUser: Codable {
    let id: UUID
    let email: String?
    let userMetadata: [String: JSONValue]?

    enum CodingKeys: String, CodingKey {
        case id, email
        case userMetadata = "user_metadata"
    }
}

enum JSONValue: Codable {
    case string(String), number(Double), bool(Bool), object([String: JSONValue]), array([JSONValue]), null

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if container.decodeNil() { self = .null }
        else if let value = try? container.decode(Bool.self) { self = .bool(value) }
        else if let value = try? container.decode(Double.self) { self = .number(value) }
        else if let value = try? container.decode(String.self) { self = .string(value) }
        else if let value = try? container.decode([String: JSONValue].self) { self = .object(value) }
        else { self = .array(try container.decode([JSONValue].self)) }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .string(let value): try container.encode(value)
        case .number(let value): try container.encode(value)
        case .bool(let value): try container.encode(value)
        case .object(let value): try container.encode(value)
        case .array(let value): try container.encode(value)
        case .null: try container.encodeNil()
        }
    }

    var stringValue: String? { if case .string(let value) = self { return value }; return nil }
}

struct FriendProfile: Decodable, Identifiable {
    let userID: UUID
    let displayName: String
    let shareWithFriends: Bool
    var id: UUID { userID }

    enum CodingKeys: String, CodingKey {
        case userID = "user_id", displayName = "display_name", shareWithFriends = "share_with_friends"
    }
}

struct FriendGroup: Decodable, Identifiable {
    let id: UUID
    let name: String
}

struct FriendFeedEntry: Decodable, Identifiable {
    let displayName: String
    let currentStreak: Int
    var id: String { displayName }

    enum CodingKeys: String, CodingKey {
        case displayName = "display_name", currentStreak = "current_streak"
    }
}

struct Invitation: Decodable {
    let invitationID: UUID
    let invitationSecret: String
    let expiresAt: Date

    enum CodingKeys: String, CodingKey {
        case invitationID = "invitation_id", invitationSecret = "invitation_secret", expiresAt = "expires_at"
    }
}

@MainActor
final class EkkoBackend: ObservableObject {
    @Published private(set) var session: EkkoSession?
    @Published private(set) var profile: FriendProfile?
    @Published private(set) var groups: [FriendGroup] = []
    @Published private(set) var friends: [FriendFeedEntry] = []
    @Published var errorMessage: String?
    @Published var infoMessage: String?
    @Published private(set) var isLoading = false

    private let baseURL: URL?
    private let publishableKey: String
    private let encoder = JSONEncoder()
    private let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let value = try decoder.singleValueContainer().decode(String.self)
            let formatter = ISO8601DateFormatter()
            formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            if let date = formatter.date(from: value) { return date }
            formatter.formatOptions = [.withInternetDateTime]
            if let date = formatter.date(from: value) { return date }
            throw DecodingError.dataCorrupted(.init(codingPath: decoder.codingPath, debugDescription: "Invalid ISO-8601 date"))
        }
        return decoder
    }()
    private var appleNonce: String?

    var isConfigured: Bool { baseURL != nil && !publishableKey.isEmpty }
    var isSignedIn: Bool { session != nil }

    init() {
        baseURL = (Bundle.main.object(forInfoDictionaryKey: "EK_SUPABASE_URL") as? String).flatMap(URL.init(string:))
        publishableKey = Bundle.main.object(forInfoDictionaryKey: "EK_SUPABASE_PUBLISHABLE_KEY") as? String ?? ""
        if let saved = KeychainSession.read() { session = try? decoder.decode(EkkoSession.self, from: saved) }
        Task { await restoreSession() }
    }

    func sendEmailCode(to email: String) async {
        infoMessage = nil
        do {
            let _: EmptyResponse = try await authRequest(path: "otp", body: ["email": email, "create_user": true])
            infoMessage = "Check your email for a one-time code."
            errorMessage = nil
        } catch { errorMessage = error.localizedDescription }
    }

    func verifyEmailCode(email: String, code: String) async {
        do {
            let result: AuthResponse = try await authRequest(path: "verify", body: ["email": email, "token": code, "type": "email"])
            try setSession(result)
            infoMessage = nil
            await loadSharingData()
        } catch { errorMessage = error.localizedDescription }
    }

    func prepareAppleRequest(_ request: ASAuthorizationAppleIDRequest) {
        let nonce = Self.randomNonce()
        appleNonce = nonce
        request.requestedScopes = [.fullName, .email]
        request.nonce = Self.sha256(nonce)
    }

    func signInWithApple(_ result: Result<ASAuthorization, Error>) async {
        do {
            let authorization = try result.get()
            guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential,
                  let tokenData = credential.identityToken,
                  let idToken = String(data: tokenData, encoding: .utf8),
                  let nonce = appleNonce else { throw BackendError.message("Apple sign-in did not return a valid identity token.") }
            let response: AuthResponse = try await authRequest(path: "token?grant_type=id_token", body: [
                "provider": "apple", "id_token": idToken, "nonce": nonce
            ])
            try setSession(response)
            await loadSharingData()
            appleNonce = nil
        } catch { errorMessage = error.localizedDescription }
    }

    func signOut() async {
        if session != nil { _ = try? await request(path: "auth/v1/logout", method: "POST", authenticated: true) }
        session = nil
        profile = nil
        groups = []
        friends = []
        KeychainSession.delete()
    }

    func loadSharingData() async {
        guard session != nil else { return }
        isLoading = true
        defer { isLoading = false }
        do {
            profile = try await rest(path: "profiles?select=user_id,display_name,share_with_friends&user_id=eq.\(session!.user.id.uuidString)").first
            let memberships: [Membership] = try await rest(path: "friend_group_members?select=group_id&user_id=eq.\(session!.user.id.uuidString)")
            let ids = Array(Set(memberships.map(\.groupID)))
            if ids.isEmpty { groups = [] }
            else {
                let idFilter = ids.map(\.uuidString).joined(separator: ",")
                groups = try await rest(path: "friend_groups?select=id,name&id=in.(\(idFilter))")
            }
            friends = try await rpc(path: "friend_feed", body: [:])
            errorMessage = nil
        } catch { errorMessage = error.localizedDescription }
    }

    func setSharing(_ enabled: Bool) async {
        guard let userID = session?.user.id else { return }
        do {
            _ = try await request(path: "rest/v1/profiles?user_id=eq.\(userID.uuidString)", method: "PATCH", body: ["share_with_friends": enabled], authenticated: true, prefer: "return=minimal")
            await loadSharingData()
        } catch { errorMessage = error.localizedDescription }
    }

    func updateDisplayName(_ name: String) async {
        guard let userID = session?.user.id else { return }
        do {
            _ = try await request(path: "rest/v1/profiles?user_id=eq.\(userID.uuidString)", method: "PATCH", body: ["display_name": name.trimmingCharacters(in: .whitespacesAndNewlines)], authenticated: true, prefer: "return=minimal")
            await loadSharingData()
        } catch { errorMessage = error.localizedDescription }
    }

    func createGroup(named name: String) async {
        do {
            let _: UUID = try await rpc(path: "create_friend_group", body: ["p_name": name])
            await loadSharingData()
        } catch { errorMessage = error.localizedDescription }
    }

    func makeInvitation(for groupID: UUID) async -> String? {
        do {
            let result: [Invitation] = try await rpc(path: "create_friend_group_invitation", body: ["p_group_id": groupID.uuidString, "p_lifetime": "3 days"])
            return result.first?.invitationSecret
        } catch { errorMessage = error.localizedDescription; return nil }
    }

    func joinGroup(using secret: String) async {
        do {
            let _: UUID = try await rpc(path: "accept_friend_group_invitation", body: ["p_invitation_secret": secret.trimmingCharacters(in: .whitespacesAndNewlines)])
            await loadSharingData()
            infoMessage = "You joined the circle."
        } catch { errorMessage = error.localizedDescription }
    }

    func recordOutcome(_ outcome: String) async {
        guard session != nil else { return }
        do {
            let _: [OutcomeResult] = try await rpc(path: "record_daily_outcome", body: ["p_outcome": outcome])
            await loadSharingData()
        } catch { errorMessage = error.localizedDescription }
    }

    private func restoreSession() async {
        guard let current = session else { return }
        if current.isExpired {
            do {
                let refreshed: AuthResponse = try await authRequest(path: "token?grant_type=refresh_token", body: ["refresh_token": current.refreshToken])
                try setSession(refreshed)
            } catch { session = nil; KeychainSession.delete(); return }
        }
        await loadSharingData()
    }

    private func refreshSessionIfNeeded() async throws {
        guard let current = session, current.isExpired else { return }
        do {
            let refreshed: AuthResponse = try await authRequest(path: "token?grant_type=refresh_token", body: ["refresh_token": current.refreshToken])
            try setSession(refreshed)
        } catch {
            session = nil
            profile = nil
            groups = []
            friends = []
            KeychainSession.delete()
            throw error
        }
    }

    private func setSession(_ response: AuthResponse) throws {
        guard let user = response.user, let accessToken = response.accessToken, let refreshToken = response.refreshToken else {
            throw BackendError.message("The sign-in response did not include a session.")
        }
        let newSession = EkkoSession(accessToken: accessToken, refreshToken: refreshToken,
                                     expiresAt: Date().addingTimeInterval(TimeInterval(response.expiresIn ?? 3600)), user: user)
        session = newSession
        KeychainSession.write(try encoder.encode(newSession))
    }

    private func authRequest<T: Decodable>(path: String, body: [String: Any]) async throws -> T {
        try await send(path: "auth/v1/\(path)", method: "POST", body: body, authenticated: false)
    }

    private func rest<T: Decodable>(path: String) async throws -> [T] {
        try await send(path: "rest/v1/\(path)", method: "GET", body: nil, authenticated: true)
    }

    private func rpc<T: Decodable>(path: String, body: [String: Any]) async throws -> T {
        try await send(path: "rest/v1/rpc/\(path)", method: "POST", body: body, authenticated: true)
    }

    private func request(path: String, method: String, body: Any? = nil, authenticated: Bool, prefer: String? = nil) async throws -> Data {
        try await send(path: path, method: method, body: body, authenticated: authenticated, prefer: prefer) as Data
    }

    private func send<T: Decodable>(path: String, method: String, body: Any?, authenticated: Bool, prefer: String? = nil) async throws -> T {
        if authenticated { try await refreshSessionIfNeeded() }
        guard let baseURL else { throw BackendError.message("Add the Supabase URL and publishable key to the Ekko build settings to enable sign-in.") }
        let parts = path.split(separator: "?", maxSplits: 1, omittingEmptySubsequences: false)
        var components = URLComponents(url: baseURL, resolvingAgainstBaseURL: false)!
        components.path = components.path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        components.path += "/" + String(parts[0])
        if parts.count == 2 { components.percentEncodedQuery = String(parts[1]) }
        guard let url = components.url else { throw BackendError.message("The Supabase URL is invalid.") }
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue(publishableKey, forHTTPHeaderField: "apikey")
        let token = authenticated ? session?.accessToken : nil
        request.setValue("Bearer \(token ?? publishableKey)", forHTTPHeaderField: "Authorization")
        if let prefer { request.setValue(prefer, forHTTPHeaderField: "Prefer") }
        if let body {
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        }
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse else { throw BackendError.message("The server response was invalid.") }
        guard (200..<300).contains(http.statusCode) else {
            let error = (try? decoder.decode(AuthError.self, from: data))
            throw BackendError.message(error?.message ?? error?.msg ?? "Request failed (\(http.statusCode)).")
        }
        if T.self == Data.self { return data as! T }
        return try decoder.decode(T.self, from: data)
    }

    private static func randomNonce(length: Int = 32) -> String {
        let chars = Array("0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._")
        var result = ""
        while result.count < length {
            var byte: UInt8 = 0
            guard SecRandomCopyBytes(kSecRandomDefault, 1, &byte) == errSecSuccess else { continue }
            if byte < chars.count { result.append(chars[Int(byte)]) }
        }
        return result
    }

    private static func sha256(_ value: String) -> String {
        SHA256.hash(data: Data(value.utf8)).map { String(format: "%02x", $0) }.joined()
    }
}

private struct AuthResponse: Decodable {
    let accessToken: String?
    let refreshToken: String?
    let expiresIn: Int?
    let user: AuthUser?
    enum CodingKeys: String, CodingKey { case accessToken = "access_token", refreshToken = "refresh_token", expiresIn = "expires_in", user }
}
private struct EmptyResponse: Decodable {}
private struct AuthError: Decodable { let message: String?; let msg: String? }
private struct Membership: Decodable { let groupID: UUID; enum CodingKeys: String, CodingKey { case groupID = "group_id" } }
private struct OutcomeResult: Decodable { let localDate: String; let outcome: String; enum CodingKeys: String, CodingKey { case localDate = "local_date", outcome } }
private enum BackendError: LocalizedError { case message(String); var errorDescription: String? { if case .message(let text) = self { return text }; return nil } }

private enum KeychainSession {
    private static let service = "com.ekko.morning.session"
    static func read() -> Data? {
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: service, kSecReturnData as String: true]
        var result: CFTypeRef?
        guard SecItemCopyMatching(query as CFDictionary, &result) == errSecSuccess else { return nil }
        return result as? Data
    }
    static func write(_ data: Data) {
        delete()
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: service, kSecValueData as String: data, kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly]
        SecItemAdd(query as CFDictionary, nil)
    }
    static func delete() {
        SecItemDelete([kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: service] as CFDictionary)
    }
}
