import DeviceActivity
import FamilyControls
import Foundation
import Combine
import ManagedSettings

enum EkkoScreenTime {
    static let appGroup = "group.com.ekko.morning"
    static let morningActivity = DeviceActivityName("ekko.morning")
    static let peekActivity = DeviceActivityName("ekko.peek")
    static let selectionKey = "ekko.screenTime.selection"
    static let configuredKey = "ekko.screenTime.configured"
    static let completedDayKey = "ekko.routine.completedDay"
    static let skippedDayKey = "ekko.routine.skippedDay"
    static let peekDayKey = "ekko.routine.peekDay"
    static let peekUntilKey = "ekko.routine.peekUntil"

    static var sharedContainerAvailable: Bool {
        FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroup) != nil
    }

    static var defaults: UserDefaults {
        UserDefaults(suiteName: appGroup) ?? .standard
    }

    static var store: ManagedSettingsStore { ManagedSettingsStore() }

    static func isAuthorized(_ status: AuthorizationStatus) -> Bool {
        if status == .approved { return true }
        if #available(iOS 26.4, *) { return status == .approvedWithDataAccess }
        return false
    }

    static func dayKey(for date: Date = .now) -> String {
        let morningDay = Calendar.current.date(byAdding: .hour, value: -5, to: date) ?? date
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.calendar = Calendar.current
        formatter.timeZone = TimeZone.current
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: morningDay)
    }

    static func loadSelection() -> FamilyActivitySelection? {
        guard let data = defaults.data(forKey: selectionKey) else { return nil }
        return try? JSONDecoder().decode(FamilyActivitySelection.self, from: data)
    }

    static func saveSelection(_ selection: FamilyActivitySelection) throws {
        let data = try JSONEncoder().encode(selection)
        defaults.set(data, forKey: selectionKey)
    }

    static func shouldShield(at date: Date = .now) -> Bool {
        let day = dayKey(for: date)
        guard sharedContainerAvailable,
              Calendar.current.component(.hour, from: date) >= 5,
              defaults.bool(forKey: configuredKey),
              isAuthorized(AuthorizationCenter.shared.authorizationStatus),
              let selection = loadSelection(),
              !selection.applicationTokens.isEmpty,
              defaults.string(forKey: completedDayKey) != day,
              defaults.string(forKey: skippedDayKey) != day else { return false }

        if let peekUntil = defaults.object(forKey: peekUntilKey) as? Date,
           date < peekUntil {
            return false
        }
        return true
    }

    static func applyCurrentShield(at date: Date = .now) {
        guard shouldShield(at: date), let selection = loadSelection() else {
            clearShield()
            return
        }
        store.shield.applications = selection.applicationTokens
        store.shield.applicationCategories = nil
        store.shield.webDomains = nil
        store.shield.webDomainCategories = nil
    }

    static func clearShield() {
        store.shield.applications = nil
        store.shield.applicationCategories = nil
        store.shield.webDomains = nil
        store.shield.webDomainCategories = nil
    }
}

@MainActor
final class ScreenTimeController: ObservableObject {
    @Published private(set) var authorizationStatus = AuthorizationCenter.shared.authorizationStatus
    @Published private(set) var errorMessage: String?
    @Published private(set) var selection: FamilyActivitySelection

    private let activityCenter = DeviceActivityCenter()

    init() {
        selection = EkkoScreenTime.loadSelection() ?? FamilyActivitySelection()
        if !EkkoScreenTime.sharedContainerAvailable {
            errorMessage = "Shared Screen Time storage isn’t available for this signed build."
        }
    }

    var isAuthorized: Bool { EkkoScreenTime.isAuthorized(authorizationStatus) }
    var selectionCount: Int { selection.applicationTokens.count }
    var isEnforcing: Bool {
        EkkoScreenTime.sharedContainerAvailable && isAuthorized && errorMessage == nil &&
            EkkoScreenTime.defaults.bool(forKey: EkkoScreenTime.configuredKey) &&
            selectionCount > 0
    }

    func requestAuthorization() async {
        do {
            try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
            authorizationStatus = AuthorizationCenter.shared.authorizationStatus
            errorMessage = nil
        } catch {
            authorizationStatus = AuthorizationCenter.shared.authorizationStatus
            errorMessage = error.localizedDescription
        }
        refreshEnforcement()
    }

    func refreshAuthorization() {
        authorizationStatus = AuthorizationCenter.shared.authorizationStatus
        refreshEnforcement()
    }

    func saveSelection(_ newSelection: FamilyActivitySelection) {
        var appsOnly = FamilyActivitySelection()
        appsOnly.applicationTokens = newSelection.applicationTokens
        selection = appsOnly
        do {
            try EkkoScreenTime.saveSelection(appsOnly)
            guard EkkoScreenTime.sharedContainerAvailable else {
                errorMessage = "Shared Screen Time storage isn’t available for this signed build."
                EkkoScreenTime.clearShield()
                return
            }
            errorMessage = nil
            if EkkoScreenTime.defaults.bool(forKey: EkkoScreenTime.configuredKey) {
                try startMorningMonitoring()
                EkkoScreenTime.defaults.set(!selection.applicationTokens.isEmpty, forKey: EkkoScreenTime.configuredKey)
            }
            refreshEnforcement()
        } catch {
            EkkoScreenTime.defaults.set(false, forKey: EkkoScreenTime.configuredKey)
            EkkoScreenTime.clearShield()
            errorMessage = error.localizedDescription
        }
    }

    func activate() {
        guard EkkoScreenTime.sharedContainerAvailable else {
            errorMessage = "Shared Screen Time storage isn’t available for this signed build."
            EkkoScreenTime.clearShield()
            return
        }
        guard isAuthorized else { return }
        do {
            try EkkoScreenTime.saveSelection(selection)
            try startMorningMonitoring()
            EkkoScreenTime.defaults.set(!selection.applicationTokens.isEmpty, forKey: EkkoScreenTime.configuredKey)
            refreshEnforcement()
            errorMessage = nil
        } catch {
            EkkoScreenTime.defaults.set(false, forKey: EkkoScreenTime.configuredKey)
            errorMessage = error.localizedDescription
            EkkoScreenTime.clearShield()
        }
    }

    func completeRoutine(for day: String) {
        EkkoScreenTime.defaults.set(day, forKey: EkkoScreenTime.completedDayKey)
        EkkoScreenTime.clearShield()
    }

    func skipToday(for day: String) {
        EkkoScreenTime.defaults.set(day, forKey: EkkoScreenTime.skippedDayKey)
        EkkoScreenTime.clearShield()
    }

    func startPeek(for day: String) {
        guard EkkoScreenTime.defaults.string(forKey: EkkoScreenTime.peekDayKey) != day else {
            errorMessage = "You’ve already used today’s 10-minute peek."
            return
        }
        let end = Date.now.addingTimeInterval(10 * 60)
        let calendar = Calendar.current
        let startComponents = calendar.dateComponents([.hour, .minute, .second], from: .now)
        let endComponents = calendar.dateComponents([.hour, .minute, .second], from: end)
        do {
            activityCenter.stopMonitoring([EkkoScreenTime.peekActivity])
            try activityCenter.startMonitoring(
                EkkoScreenTime.peekActivity,
                during: DeviceActivitySchedule(
                    intervalStart: startComponents,
                    intervalEnd: endComponents,
                    repeats: false
                )
            )
            EkkoScreenTime.defaults.set(day, forKey: EkkoScreenTime.peekDayKey)
            EkkoScreenTime.defaults.set(end, forKey: EkkoScreenTime.peekUntilKey)
            EkkoScreenTime.clearShield()
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
            refreshEnforcement()
        }
    }

    func refreshEnforcement() {
        authorizationStatus = AuthorizationCenter.shared.authorizationStatus
        if !EkkoScreenTime.sharedContainerAvailable {
            errorMessage = "Shared Screen Time storage isn’t available for this signed build."
            EkkoScreenTime.clearShield()
            return
        }
        if !isAuthorized {
            EkkoScreenTime.clearShield()
            return
        }
        EkkoScreenTime.applyCurrentShield()
    }

    private func startMorningMonitoring() throws {
        guard !selection.applicationTokens.isEmpty else {
            activityCenter.stopMonitoring([EkkoScreenTime.morningActivity])
            EkkoScreenTime.clearShield()
            return
        }

        activityCenter.stopMonitoring([EkkoScreenTime.morningActivity])
        let schedule = DeviceActivitySchedule(
            intervalStart: DateComponents(hour: 5, minute: 0),
            intervalEnd: DateComponents(hour: 4, minute: 59),
            repeats: true
        )
        try activityCenter.startMonitoring(EkkoScreenTime.morningActivity, during: schedule)
    }
}
