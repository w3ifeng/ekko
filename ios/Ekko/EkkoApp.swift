import SwiftUI
import AuthenticationServices
import UIKit

private enum EkkoPalette {
    static let paper = Color(hex: 0xF4F4EF)
    static let card = Color(hex: 0xFFFEFA)
    static let ink = Color(hex: 0x292F2D)
    static let secondary = Color(hex: 0x4A534D)
    static let muted = Color(hex: 0x747B75)
    static let moss = Color(hex: 0x386C5C)
    static let mossDark = Color(hex: 0x25382F)
    static let mossDeep = Color(hex: 0x17241E)
    static let mint = Color(hex: 0xE2EFE8)
    static let ember = Color(hex: 0xD77F4C)
    static let yolk = Color(hex: 0xF2C14E)
    static let border = Color(hex: 0xE5E8DF)
    static let clay = Color(hex: 0xEADBCC)
    static let sky = Color(hex: 0xDCE7ED)
    static let lilac = Color(hex: 0xE4DEF0)
}

private extension Color {
    init(hex: UInt) {
        self.init(.sRGB, red: Double((hex >> 16) & 0xff) / 255,
                  green: Double((hex >> 8) & 0xff) / 255,
                  blue: Double(hex & 0xff) / 255, opacity: 1)
    }
}

private struct RoutineStep: Identifiable, Codable, Equatable {
    let id: UUID
    var title: String
    var detail: String
    var symbol: String
    var required: Bool
    var done = false

    init(_ title: String, _ detail: String, _ symbol: String, required: Bool, done: Bool = false) {
        self.id = UUID()
        self.title = title
        self.detail = detail
        self.symbol = symbol
        self.required = required
        self.done = done
    }
}

private enum EkkoTab: String, CaseIterable {
    case today = "Today", circle = "Circle", plan = "Plan"
    var symbol: String {
        switch self {
        case .today: return "sunrise.fill"
        case .circle: return "person.2.fill"
        case .plan: return "checklist"
        }
    }
}

@main
struct EkkoApp: App {
    var body: some Scene {
        WindowGroup { EkkoRootView() }
    }
}

private struct EkkoRootView: View {
    @Environment(\.scenePhase) private var scenePhase
    @StateObject private var backend = EkkoBackend()
    @State private var selectedTab: EkkoTab = .today
    @StateObject private var screenTime = ScreenTimeController()
    @AppStorage("ekko.setup.complete", store: EkkoScreenTime.defaults) private var hasSetUp = false
    @AppStorage("ekko.streak", store: EkkoScreenTime.defaults) private var streak = 0
    @AppStorage("ekko.routine.steps", store: EkkoScreenTime.defaults) private var savedSteps = Data()
    @AppStorage("ekko.routine.day", store: EkkoScreenTime.defaults) private var savedRoutineDay = ""
    @State private var showAccessSheet = false
    @State private var accessChoice = "peek"
    @State private var showCelebration = false
    @State private var notice: String?
    @State private var steps = [
        RoutineStep("Brush teeth", "About 2 min", "drop.fill", required: true),
        RoutineStep("Glass of water", "Before coffee", "waterbottle.fill", required: true),
        RoutineStep("Get ready", "Take your time", "tshirt.fill", required: true),
        RoutineStep("Skincare", "Skip if you like", "sparkles", required: false)
    ]
    private var requiredCount: Int { steps.filter(\.required).count }
    private var requiredDone: Int { steps.filter { $0.required && $0.done }.count }
    private var allRequiredDone: Bool { requiredCount > 0 && requiredDone == requiredCount }
    private var todayKey: String { EkkoScreenTime.dayKey() }
    private var didWake: Bool { EkkoScreenTime.defaults.string(forKey: EkkoScreenTime.completedDayKey) == todayKey }
    private var streakEnded: Bool { EkkoScreenTime.defaults.string(forKey: EkkoScreenTime.skippedDayKey) == todayKey }
    private var peekUsedToday: Bool { EkkoScreenTime.defaults.string(forKey: EkkoScreenTime.peekDayKey) == todayKey }

    var body: some View {
        ZStack(alignment: .top) {
            EkkoPalette.paper.ignoresSafeArea()
            if !hasSetUp {
                PlanScreen(screenTime: screenTime, steps: $steps, setup: true) {
                    guard screenTime.isAuthorized, screenTime.selectionCount > 0 else { return }
                    hasSetUp = true
                    savedRoutineDay = todayKey
                    saveSteps()
                    screenTime.activate()
                    selectedTab = .today
                    toast("See you at 5:00 am")
                }
            } else if showCelebration {
                UnlockedScreen(appCount: screenTime.selectionCount, streak: streak) {
                    showCelebration = false
                    selectedTab = .circle
                } backToday: {
                    showCelebration = false
                    selectedTab = .today
                }
            } else {
                Group {
                    switch selectedTab {
                    case .today:
                        TodayScreen(steps: $steps, appCount: screenTime.selectionCount,
                                    streak: streak, streakEnded: streakEnded, done: allRequiredDone,
                                    didWake: didWake, enforcing: screenTime.isEnforcing,
                                    accessEnabled: screenTime.isEnforcing,
                                    onRoutineChanged: routineChanged,
                                    onWake: { showCelebration = true }, onAccess: {
                                        accessChoice = peekUsedToday ? "skip" : "peek"
                                        showAccessSheet = true
                                    })
                    case .circle:
                        CircleScreen(backend: backend)
                    case .plan:
                        PlanScreen(screenTime: screenTime, steps: $steps, setup: false) {
                            saveSteps()
                            screenTime.refreshEnforcement()
                            selectedTab = .today
                            toast("Plan saved")
                        }
                    }
                }
                .safeAreaInset(edge: .bottom, spacing: 0) { TabBar(selection: $selectedTab) }
            }
            if let notice {
                Text(notice)
                    .font(.system(size: 14, weight: .semibold, design: .rounded))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 18).padding(.vertical, 12)
                    .background(EkkoPalette.mossDark, in: Capsule())
                    .shadow(color: EkkoPalette.mossDeep.opacity(0.18), radius: 12, y: 4)
                    .padding(.top, 8)
                    .transition(.move(edge: .top).combined(with: .opacity))
            }
        }
        .preferredColorScheme(.light)
        .task {
            if let restored = try? JSONDecoder().decode([RoutineStep].self, from: savedSteps) { steps = restored }
            resetRoutineForNewDay()
            screenTime.refreshAuthorization()
        }
        .onChange(of: scenePhase) { phase in
            guard phase == .active else { return }
            resetRoutineForNewDay()
            screenTime.refreshAuthorization()
        }
        .onChange(of: steps) { _ in routineChanged() }
        .onChange(of: screenTime.selection) { _ in screenTime.refreshEnforcement() }
        .sheet(isPresented: $showAccessSheet) {
            AccessSheet(choice: $accessChoice, streak: streak, peekUsed: peekUsedToday) { choice in
                showAccessSheet = false
                if choice == "skip" {
                    streak = 0
                    screenTime.skipToday(for: todayKey)
                    Task { await backend.recordOutcome("skipped") }
                    toast("Skipped today. Fresh start tomorrow.")
                } else {
                    screenTime.startPeek(for: todayKey)
                    if let error = screenTime.errorMessage { toast("Couldn’t start your peek: \(error)") }
                    else { toast("Your 10-minute peek has started.") }
                }
            }
            .presentationDetents([.medium, .large])
            .presentationDragIndicator(.visible)
        }
    }

    private func toast(_ message: String) {
        withAnimation(.spring(response: 0.35, dampingFraction: 0.82)) { notice = message }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.1) {
            withAnimation(.easeOut(duration: 0.2)) { if notice == message { notice = nil } }
        }
    }

    private func saveSteps() {
        if let data = try? JSONEncoder().encode(steps) { savedSteps = data }
    }

    private func resetRoutineForNewDay() {
        guard savedRoutineDay != todayKey else { return }
        for index in steps.indices { steps[index].done = false }
        savedRoutineDay = todayKey
        saveSteps()
    }

    private func routineChanged() {
        saveSteps()
        guard hasSetUp, allRequiredDone, !didWake, !streakEnded else { return }
        screenTime.completeRoutine(for: todayKey)
        streak += 1
        Task { await backend.recordOutcome("completed") }
        showCelebration = true
    }
}

private struct PlanScreen: View {
    @ObservedObject var screenTime: ScreenTimeController
    @Binding var steps: [RoutineStep]
    let setup: Bool
    let onSave: () -> Void
    @State private var showingAppPicker = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                HStack {
                    Text("ekko").font(.system(size: 26, weight: .heavy, design: .rounded)).tracking(-1.5).foregroundStyle(EkkoPalette.moss)
                    Spacer()
                    Text(setup ? "YOUR FIRST MORNING" : "CHANGES APPLY NOW")
                        .font(.system(size: 10, weight: .bold, design: .rounded)).tracking(1.1)
                        .foregroundStyle(EkkoPalette.muted)
                }.padding(.bottom, 20)
                Text("What should sleep in until you’re up?")
                    .font(.system(size: 31, weight: .bold, design: .rounded)).tracking(-1.1)
                    .foregroundStyle(EkkoPalette.ink).fixedSize(horizontal: false, vertical: true)
                Text("Choose which apps sleep at 5:00 am. They wake when your required steps are done, or you use one 10-minute peek or choose Skip today.")
                    .font(.system(size: 15)).foregroundStyle(EkkoPalette.muted).lineSpacing(3).padding(.top, 8).padding(.bottom, 20)
                Card {
                    VStack(alignment: .leading, spacing: 10) {
                        HStack(spacing: 12) {
                            Image(systemName: "moon.zzz.fill").font(.system(size: 17)).foregroundStyle(EkkoPalette.moss)
                                .frame(width: 38, height: 38).background(EkkoPalette.mint, in: RoundedRectangle(cornerRadius: 12))
                            VStack(alignment: .leading, spacing: 3) {
                                Text("Apps to sleep").font(.system(size: 15, weight: .semibold)).foregroundStyle(EkkoPalette.ink)
                                Text("\(screenTime.selectionCount) selected").font(.system(size: 12)).foregroundStyle(EkkoPalette.muted)
                            }
                            Spacer()
                            if screenTime.isAuthorized && screenTime.errorMessage == nil {
                                Button("Choose") { showingAppPicker = true }
                                    .font(.system(size: 13, weight: .semibold)).foregroundStyle(EkkoPalette.moss)
                            }
                        }
                        if !screenTime.isAuthorized {
                            Text("Screen Time access is off, so EKKO cannot put apps to sleep.")
                                .font(.system(size: 12)).foregroundStyle(EkkoPalette.muted)
                            Button {
                                Task { await screenTime.requestAuthorization() }
                            } label: {
                                Label("Turn on Screen Time access", systemImage: "lock.shield")
                                    .font(.system(size: 14, weight: .semibold)).foregroundStyle(EkkoPalette.moss)
                            }.buttonStyle(.plain)
                        } else if let error = screenTime.errorMessage {
                            Text("Screen Time isn’t enforcing right now: \(error)")
                                .font(.system(size: 12)).foregroundStyle(Color(hex: 0xB4483A))
                        } else {
                            Text("Choose individual apps only. Leave EKKO unchecked so your routine stays available.")
                                .font(.system(size: 12)).foregroundStyle(EkkoPalette.muted)
                        }
                    }
                }
                HStack {
                    Text("Your morning").font(.system(size: 17, weight: .bold)).foregroundStyle(EkkoPalette.ink)
                    Spacer()
                    Text("\(steps.filter(\.required).count) required").font(.system(size: 13, weight: .medium)).foregroundStyle(EkkoPalette.muted)
                }.padding(.top, 23).padding(.bottom, 10)
                Card {
                    VStack(spacing: 0) {
                        ForEach(steps.indices, id: \.self) { index in
                            HStack(spacing: 10) {
                                Image(systemName: steps[index].symbol).font(.system(size: 16, weight: .medium))
                                    .foregroundStyle(EkkoPalette.secondary).frame(width: 36, height: 36).background(EkkoPalette.paper, in: RoundedRectangle(cornerRadius: 11))
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(steps[index].title).font(.system(size: 14, weight: .semibold)).foregroundStyle(EkkoPalette.ink)
                                    Text(steps[index].detail).font(.system(size: 11)).foregroundStyle(EkkoPalette.muted)
                                }.frame(maxWidth: .infinity, alignment: .leading)
                                Menu {
                                    Button { steps[index].required = true } label: { Label("Required", systemImage: steps[index].required ? "checkmark" : "") }
                                    Button { steps[index].required = false } label: { Label("Optional", systemImage: !steps[index].required ? "checkmark" : "") }
                                } label: {
                                    Text(steps[index].required ? "Required" : "Optional")
                                        .font(.system(size: 11, weight: .semibold)).foregroundStyle(steps[index].required ? EkkoPalette.moss : EkkoPalette.muted)
                                        .padding(.horizontal, 9).padding(.vertical, 7).background(steps[index].required ? EkkoPalette.mint : EkkoPalette.paper, in: Capsule())
                                }.accessibilityLabel("\(steps[index].title), \(steps[index].required ? "required" : "optional")")
                            }.padding(.vertical, 10)
                            if index != steps.count - 1 { Divider().overlay(EkkoPalette.border).padding(.leading, 46) }
                        }
                        Button {
                            steps.append(RoutineStep("New morning step", "Add your own ritual", "sparkles", required: false))
                        } label: {
                            Label("Add a step", systemImage: "plus").font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(EkkoPalette.moss).frame(maxWidth: .infinity, alignment: .leading).padding(.top, 13)
                        }.buttonStyle(.plain)
                    }
                }
                HStack(alignment: .top, spacing: 12) {
                    Image(systemName: "moon.stars.fill").foregroundStyle(EkkoPalette.moss).font(.system(size: 19))
                    Text("Lights out at 5:00 am. Selected apps stay asleep until your required steps are done, a 10-minute peek, or a full-day Skip.")
                        .font(.system(size: 13)).foregroundStyle(EkkoPalette.mossDark).fixedSize(horizontal: false, vertical: true)
                }.padding(15).frame(maxWidth: .infinity, alignment: .leading).background(EkkoPalette.mint, in: RoundedRectangle(cornerRadius: 18)).padding(.top, 14)
                Button(action: onSave) {
                    HStack { Spacer(); Text(setup ? "Save my morning" : "Save plan"); Spacer(); Image(systemName: "arrow.right") }
                        .font(.system(size: 16, weight: .semibold)).foregroundStyle(.white).padding(.horizontal, 18).frame(height: 54)
                        .background(EkkoPalette.moss, in: RoundedRectangle(cornerRadius: 15))
                }.buttonStyle(.plain)
                    .disabled(!screenTime.isAuthorized || screenTime.errorMessage != nil || screenTime.selectionCount == 0 || !steps.contains(where: \.required))
                    .opacity(screenTime.isAuthorized && screenTime.errorMessage == nil && screenTime.selectionCount > 0 && steps.contains(where: \.required) ? 1 : 0.45)
                    .padding(.top, 18).padding(.bottom, 25)
            }.padding(.horizontal, 18).padding(.top, 14)
        }.background(EkkoPalette.paper.ignoresSafeArea())
            .familyActivityPicker(isPresented: $showingAppPicker, selection: Binding(
                get: { screenTime.selection },
                set: { screenTime.saveSelection($0) }
            ))
    }
}

private struct TodayScreen: View {
    @Binding var steps: [RoutineStep]
    let appCount: Int
    let streak: Int
    let streakEnded: Bool
    let done: Bool
    let didWake: Bool
    let enforcing: Bool
    let accessEnabled: Bool
    let onRoutineChanged: () -> Void
    let onWake: () -> Void
    let onAccess: () -> Void
    private var count: Int { steps.filter(\.required).count }
    private var checked: Int { steps.filter { $0.required && $0.done }.count }
    private var remaining: Int { count - checked }

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                SunriseHero(progress: count == 0 ? 0 : Double(checked) / Double(count), appCount: appCount, awakeToday: streakEnded || didWake, screenTimeReady: enforcing, title: "Good morning,", subtitle: "Sam.")
                    .padding(.horizontal, 0)
                VStack(alignment: .leading, spacing: 0) {
                    HStack(alignment: .center) {
                        Text(streakEnded ? "Apps are awake for today." : didWake ? "Apps are awake. Nice one." : done ? "All done. Nice one." : remaining == 1 ? "One more step" : "\(remaining) steps till the sun’s up")
                            .font(.system(size: 16, weight: .bold, design: .rounded)).foregroundStyle(EkkoPalette.ink)
                        Spacer()
                        if streakEnded { SmallPill(text: "Streak restarts tomorrow", tint: EkkoPalette.paper, foreground: EkkoPalette.muted) }
                        else { Label("\(streak)", systemImage: "flame.fill").font(.system(size: 14, weight: .bold)).foregroundStyle(EkkoPalette.ember).padding(.horizontal, 11).padding(.vertical, 8).background(Color(hex: 0xF8E6DA), in: Capsule()) }
                    }
                    GeometryReader { proxy in
                        ZStack(alignment: .leading) {
                            Capsule().fill(EkkoPalette.border)
                            Capsule().fill(EkkoPalette.ember).frame(width: proxy.size.width * (count == 0 ? 0 : CGFloat(checked) / CGFloat(count)))
                        }
                    }.frame(height: 8).padding(.top, 12).padding(.bottom, 14)
                    Card {
                        VStack(spacing: 0) {
                            ForEach(steps.indices, id: \.self) { index in
                                Button {
                                    withAnimation(.spring(response: 0.3, dampingFraction: 0.72)) { steps[index].done.toggle() }
                                    onRoutineChanged()
                                } label: {
                                    HStack(spacing: 12) {
                                        Image(systemName: steps[index].done ? "checkmark.circle.fill" : steps[index].symbol)
                                            .font(.system(size: 19, weight: .medium)).foregroundStyle(steps[index].done ? EkkoPalette.moss : EkkoPalette.secondary)
                                            .frame(width: 38, height: 38).background(steps[index].done ? EkkoPalette.mint : EkkoPalette.paper, in: RoundedRectangle(cornerRadius: 12))
                                        VStack(alignment: .leading, spacing: 3) {
                                            Text(steps[index].title).font(.system(size: 15, weight: .semibold)).foregroundStyle(EkkoPalette.ink)
                                            Text(steps[index].required ? steps[index].detail : "Optional · \(steps[index].detail)").font(.system(size: 12)).foregroundStyle(EkkoPalette.muted)
                                        }
                                        Spacer()
                                        if steps[index].done { Image(systemName: "checkmark").font(.system(size: 13, weight: .bold)).foregroundStyle(EkkoPalette.moss) }
                                    }.contentShape(Rectangle()).padding(.vertical, 10)
                                }.buttonStyle(.plain).accessibilityHint(steps[index].required ? "Required for your apps to wake" : "Optional step; does not hold up your morning")
                                if index != steps.count - 1 { Divider().overlay(EkkoPalette.border).padding(.leading, 50) }
                            }
                        }
                    }
                    Button(action: onWake) {
                        HStack(spacing: 9) { Image(systemName: done || streakEnded ? "sunrise.fill" : "lock.fill"); Text(streakEnded ? "Apps awake until tomorrow" : didWake ? "Apps are awake" : done ? "Wake my apps" : "\(remaining) to go") }
                            .font(.system(size: 16, weight: .semibold)).foregroundStyle(done && !streakEnded ? EkkoPalette.ink : .white)
                            .frame(maxWidth: .infinity).frame(height: 54)
                            .background(done && !streakEnded ? EkkoPalette.yolk : EkkoPalette.moss.opacity(streakEnded ? 0.45 : 1), in: RoundedRectangle(cornerRadius: 15))
                    }.buttonStyle(.plain).disabled(!done || streakEnded || didWake).padding(.top, 15)
                    HStack(spacing: 2) {
                        Button(accessEnabled ? "Need access now?" : "Screen Time access needed", action: onAccess)
                            .buttonStyle(GhostButton()).disabled(!accessEnabled)
                    }.frame(maxWidth: .infinity).padding(.top, 2).padding(.bottom, 25)
                    Text(enforcing ? (didWake || streakEnded ? "Selected apps are available until 5:00 am." : "\(appCount) selected apps are set to sleep.") : "Screen Time isn’t enforcing. Check access in Plan.")
                        .font(.system(size: 11)).foregroundStyle(EkkoPalette.muted).lineLimit(2).padding(.bottom, 8)
                }.padding(.horizontal, 18).padding(.top, 18)
            }
        }.background(EkkoPalette.paper.ignoresSafeArea())
    }
}

private struct CircleScreen: View {
    @ObservedObject var backend: EkkoBackend
    @State private var activePrompt: CirclePrompt?
    @State private var showSignIn = false
    @State private var groupName = "Morning circle"
    @State private var invitationCode = ""
    @State private var newInvitation: String?
    @State private var displayName = ""

    private var promptTitle: String {
        switch activePrompt {
        case .some(.create): return "Create a circle"
        case .some(.join): return "Join a circle"
        case .some(.editName): return "Your display name"
        case .some(.invitation): return "Invitation code"
        case .none: return ""
        }
    }
    private var promptMessage: String {
        switch activePrompt {
        case .some(.create): return "You'll get an invitation code to share."
        case .some(.join): return "Paste the one-time code from your friend."
        case .some(.editName): return "Only your name and shared completions appear to opted-in friends."
        case .some(.invitation): return newInvitation ?? ""
        case .none: return ""
        }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                Text("YOUR CIRCLE").font(.system(size: 11, weight: .bold)).tracking(1.3).foregroundStyle(EkkoPalette.muted).padding(.top, 16)
                Text("Mornings, together.").font(.system(size: 31, weight: .bold, design: .rounded)).tracking(-0.9).foregroundStyle(EkkoPalette.ink)
                if !backend.isConfigured {
                    Card { Label("Add your Supabase project URL and publishable key in the local build settings to enable friend sharing.", systemImage: "externaldrive").font(.system(size: 14)).foregroundStyle(EkkoPalette.secondary) }
                } else if !backend.isSignedIn {
                    Card {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Friend sharing is optional").font(.system(size: 17, weight: .bold)).foregroundStyle(EkkoPalette.ink)
                            Text("Your routine stays on this device. Sign in only when you want to invite friends or share completed mornings.").font(.system(size: 14)).foregroundStyle(EkkoPalette.muted)
                            Button("Sign in to your circle") { showSignIn = true }.buttonStyle(PrimaryActionButton())
                        }
                    }
                } else {
                    if let profile = backend.profile {
                        HStack {
                            VStack(alignment: .leading, spacing: 3) {
                                Text("Your profile").font(.system(size: 12, weight: .medium)).foregroundStyle(EkkoPalette.muted)
                                Text(profile.displayName).font(.system(size: 15, weight: .semibold)).foregroundStyle(EkkoPalette.ink)
                            }
                            Spacer()
                            Button("Edit") { displayName = profile.displayName; activePrompt = .editName }
                                .font(.system(size: 13, weight: .semibold)).foregroundStyle(EkkoPalette.moss)
                        }.padding(14).background(EkkoPalette.card, in: RoundedRectangle(cornerRadius: 15))
                        HStack(spacing: 12) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Share my mornings").font(.system(size: 14, weight: .bold)).foregroundStyle(EkkoPalette.mossDark)
                                Text("Friends see completed mornings and your current streak, never your apps or routine.").font(.system(size: 12)).foregroundStyle(EkkoPalette.secondary)
                            }
                            Spacer(minLength: 0)
                            Toggle("Share my mornings", isOn: Binding(get: { profile.shareWithFriends }, set: { value in Task { await backend.setSharing(value) } }))
                                .labelsHidden().tint(EkkoPalette.moss).accessibilityLabel("Share my mornings")
                        }.padding(15).background(EkkoPalette.mint, in: RoundedRectangle(cornerRadius: 18))
                    }
                    if backend.friends.isEmpty {
                        Card {
                            VStack(alignment: .leading, spacing: 8) {
                                Text(backend.groups.isEmpty ? "Your circle is empty" : "No shared completions yet")
                                    .font(.system(size: 17, weight: .bold)).foregroundStyle(EkkoPalette.ink)
                                Text(backend.groups.isEmpty ? "Create a circle and invite someone, or join with an invitation code." : "Friends appear here after they opt in and complete today's routine. Unopened days stay private and neutral.")
                                    .font(.system(size: 14)).foregroundStyle(EkkoPalette.muted)
                            }
                        }
                    } else {
                        Text("COMPLETED TODAY").font(.system(size: 11, weight: .bold)).tracking(1).foregroundStyle(EkkoPalette.muted)
                        Card {
                            VStack(spacing: 0) {
                                ForEach(backend.friends.indices, id: \.self) { index in
                                    let friend = backend.friends[index]
                                    HStack(spacing: 11) {
                                        Circle().fill(EkkoPalette.mint).frame(width: 40, height: 40).overlay(Text(String(friend.displayName.prefix(1)).uppercased()).font(.system(size: 15, weight: .bold)).foregroundStyle(EkkoPalette.ink))
                                        Text(friend.displayName).font(.system(size: 14, weight: .semibold)).foregroundStyle(EkkoPalette.ink)
                                        Spacer()
                                        Label("\(friend.currentStreak)", systemImage: "flame.fill").font(.system(size: 12, weight: .bold)).foregroundStyle(EkkoPalette.ember)
                                    }.padding(.vertical, 9)
                                }
                            }
                        }
                    }
                    HStack(spacing: 10) {
                        Button { activePrompt = .create } label: { Label("Create & invite", systemImage: "person.badge.plus") }.buttonStyle(SecondaryActionButton())
                        Button { activePrompt = .join } label: { Label("Join with code", systemImage: "key.horizontal") }.buttonStyle(SecondaryActionButton())
                    }
                    ForEach(backend.groups) { group in
                        HStack {
                            Label(group.name, systemImage: "person.2.fill").font(.system(size: 14, weight: .semibold)).foregroundStyle(EkkoPalette.ink)
                            Spacer()
                            Button("New code") {
                                Task {
                                    newInvitation = await backend.makeInvitation(for: group.id)
                                    if newInvitation != nil { activePrompt = .invitation }
                                }
                            }.font(.system(size: 13, weight: .semibold)).foregroundStyle(EkkoPalette.moss)
                        }.padding(14).background(EkkoPalette.card, in: RoundedRectangle(cornerRadius: 15))
                    }
                    Button("Sign out") { Task { await backend.signOut() } }.font(.system(size: 13, weight: .medium)).foregroundStyle(EkkoPalette.muted).padding(.vertical, 8)
                }
                if let message = backend.infoMessage { Text(message).font(.system(size: 13)).foregroundStyle(EkkoPalette.moss) }
                if let message = backend.errorMessage { Text(message).font(.system(size: 13)).foregroundStyle(Color(hex: 0xB4483A)) }
                if backend.isLoading { ProgressView().tint(EkkoPalette.moss).frame(maxWidth: .infinity).padding() }
            }.padding(.horizontal, 18).padding(.bottom, 24)
        }
        .background(EkkoPalette.paper.ignoresSafeArea())
        .sheet(isPresented: $showSignIn) { EmailSignInScreen(backend: backend) }
        .alert(promptTitle, isPresented: Binding(get: { activePrompt != nil }, set: { if !$0 { activePrompt = nil } })) {
            switch activePrompt {
            case .some(.create):
                TextField("Circle name", text: $groupName)
                Button("Cancel", role: .cancel) { activePrompt = nil }
                Button("Create") { activePrompt = nil; Task { await backend.createGroup(named: groupName) } }
            case .some(.join):
                TextField("Invitation code", text: $invitationCode)
                Button("Cancel", role: .cancel) { activePrompt = nil }
                Button("Join") { activePrompt = nil; Task { await backend.joinGroup(using: invitationCode) } }
            case .some(.editName):
                TextField("Name friends will see", text: $displayName)
                Button("Cancel", role: .cancel) { activePrompt = nil }
                Button("Save") { activePrompt = nil; Task { await backend.updateDisplayName(displayName) } }
            case .some(.invitation):
                Button("Copy code") {
                    if let newInvitation { UIPasteboard.general.string = newInvitation }
                    newInvitation = nil
                    activePrompt = nil
                }
                Button("Done", role: .cancel) { newInvitation = nil; activePrompt = nil }
            case .none:
                Button("Done", role: .cancel) { }
            }
        } message: { Text(promptMessage) }
    }
}

private enum CirclePrompt { case create, join, editName, invitation }

private struct EmailSignInScreen: View {
    @ObservedObject var backend: EkkoBackend
    @Environment(\.dismiss) private var dismiss
    @State private var email = ""
    @State private var code = ""
    @State private var codeRequested = false
    @State private var showAppleSignIn = (Bundle.main.object(forInfoDictionaryKey: "EK_APPLE_SIGN_IN_ENABLED") as? Bool)
        ?? ((Bundle.main.object(forInfoDictionaryKey: "EK_APPLE_SIGN_IN_ENABLED") as? String).map { ["1", "YES", "true"].contains($0) } ?? false)

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 14) {
                Text("Your circle starts here").font(.system(size: 28, weight: .bold, design: .rounded)).foregroundStyle(EkkoPalette.ink)
                Text(codeRequested ? "Enter the one-time code from your email." : "Sign in with an email code. Your routine stays local either way.")
                    .font(.system(size: 14)).foregroundStyle(EkkoPalette.muted)
                TextField("Email address", text: $email).textContentType(.emailAddress).keyboardType(.emailAddress).textInputAutocapitalization(.never).autocorrectionDisabled().padding(14).background(.white, in: RoundedRectangle(cornerRadius: 13))
                if codeRequested { TextField("One-time code", text: $code).keyboardType(.numberPad).textContentType(.oneTimeCode).padding(14).background(.white, in: RoundedRectangle(cornerRadius: 13)) }
                Button(codeRequested ? "Verify code" : "Send code") {
                    Task {
                        if codeRequested { await backend.verifyEmailCode(email: email, code: code); if backend.isSignedIn { dismiss() } }
                        else { await backend.sendEmailCode(to: email); codeRequested = backend.infoMessage != nil }
                    }
                }.buttonStyle(PrimaryActionButton()).disabled(email.isEmpty || (codeRequested && code.isEmpty))
                if showAppleSignIn {
                    SignInWithAppleButton(.signIn, onRequest: backend.prepareAppleRequest, onCompletion: { result in
                        Task { await backend.signInWithApple(result); if backend.isSignedIn { dismiss() } }
                    }).signInWithAppleButtonStyle(.black).frame(height: 48)
                }
                if let message = backend.infoMessage { Text(message).font(.system(size: 13)).foregroundStyle(EkkoPalette.moss) }
                if let message = backend.errorMessage { Text(message).font(.system(size: 13)).foregroundStyle(Color(hex: 0xB4483A)) }
                Spacer()
            }.padding(22).background(EkkoPalette.paper.ignoresSafeArea())
                .toolbar { ToolbarItem(placement: .topBarTrailing) { Button("Close") { dismiss() } } }
        }
    }
}

private struct PrimaryActionButton: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label.font(.system(size: 15, weight: .semibold)).foregroundStyle(.white)
            .frame(maxWidth: .infinity).frame(height: 50).background(EkkoPalette.moss.opacity(configuration.isPressed ? 0.78 : 1), in: RoundedRectangle(cornerRadius: 14))
    }
}
private struct SecondaryActionButton: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label.font(.system(size: 13, weight: .semibold)).foregroundStyle(EkkoPalette.moss)
            .frame(maxWidth: .infinity).frame(height: 48).background(EkkoPalette.card, in: RoundedRectangle(cornerRadius: 14))
            .overlay(RoundedRectangle(cornerRadius: 14).stroke(EkkoPalette.border, lineWidth: 1)).opacity(configuration.isPressed ? 0.7 : 1)
    }
}

private struct AccessSheet: View {
    @Binding var choice: String
    let streak: Int
    let peekUsed: Bool
    let onContinue: (String) -> Void
    @Environment(\.dismiss) private var dismiss
    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Real life happens.").font(.system(size: 27, weight: .bold, design: .rounded)).foregroundStyle(EkkoPalette.ink).padding(.top, 18)
            Text("Pick a way out. No judgement — just know what each one costs.").font(.system(size: 14)).foregroundStyle(EkkoPalette.muted)
            HStack(spacing: 9) {
                choiceCard(id: "peek", title: "10-minute peek", info: peekUsed ? "Today's peek is already used." : "Once per day. Streak safe.", symbol: "timer")
                choiceCard(id: "skip", title: "Skip today", info: "Ends your \(streak)-day streak.", symbol: "flame")
            }.frame(maxHeight: .infinity)
            Button { onContinue(choice) } label: {
                Text(choice == "skip" ? "Skip today" : "Start my 10 minutes").font(.system(size: 16, weight: .semibold)).foregroundStyle(.white).frame(maxWidth: .infinity).frame(height: 52)
                    .background(choice == "skip" ? Color(hex: 0xB4483A) : EkkoPalette.moss, in: RoundedRectangle(cornerRadius: 15))
            }.buttonStyle(.plain)
            Text("Skip keeps your apps awake for today and ends your streak.").font(.system(size: 11)).foregroundStyle(EkkoPalette.muted).frame(maxWidth: .infinity).padding(.bottom, 10)
        }.padding(.horizontal, 20).background(EkkoPalette.paper.ignoresSafeArea())
    }
    private func choiceCard(id: String, title: String, info: String, symbol: String) -> some View {
        Button { if id != "peek" || !peekUsed { choice = id } } label: {
            VStack(alignment: .leading, spacing: 8) {
                Image(systemName: symbol).font(.system(size: 18)).foregroundStyle(id == "skip" ? Color(hex: 0xB4483A) : EkkoPalette.moss)
                Text(title).font(.system(size: 14, weight: .bold)).foregroundStyle(EkkoPalette.ink)
                Text(info).font(.system(size: 11)).foregroundStyle(EkkoPalette.muted).multilineTextAlignment(.leading)
                Spacer(minLength: 0)
                if choice == id { Image(systemName: "checkmark.circle.fill").foregroundStyle(id == "skip" ? Color(hex: 0xB4483A) : EkkoPalette.moss) }
            }.frame(maxWidth: .infinity, alignment: .leading).frame(height: 118).padding(12).opacity(id == "peek" && peekUsed ? 0.55 : 1)
                .background(id == "skip" ? Color(hex: 0xF6E1DC) : EkkoPalette.mint, in: RoundedRectangle(cornerRadius: 14))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(choice == id ? (id == "skip" ? Color(hex: 0xB4483A) : EkkoPalette.moss) : EkkoPalette.border, lineWidth: choice == id ? 1.5 : 1))
        }.buttonStyle(.plain).disabled(id == "peek" && peekUsed).accessibilityAddTraits(choice == id ? .isSelected : [])
    }
}

private struct UnlockedScreen: View {
    let appCount: Int
    let streak: Int
    let onCircle: () -> Void
    let backToday: () -> Void
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                SunriseHero(progress: 1, appCount: appCount, awakeToday: true, title: "Morning first.", subtitle: "Then the feed.")
                VStack(spacing: 12) {
                    Card {
                        HStack {
                            VStack(alignment: .leading, spacing: 5) {
                                Text("YOUR STREAK").font(.system(size: 10, weight: .bold)).tracking(1).foregroundStyle(EkkoPalette.muted)
                                Label("\(streak)", systemImage: "flame.fill").font(.system(size: 25, weight: .bold, design: .rounded)).foregroundStyle(EkkoPalette.ember)
                            }
                            Spacer()
                            HStack(alignment: .bottom, spacing: 5) {
                                ForEach(0..<7, id: \.self) { day in Capsule().fill(day < 6 ? EkkoPalette.ember.opacity(0.45 + Double(day) * 0.09) : EkkoPalette.border).frame(width: 13, height: CGFloat(21 + day * 2)) }
                            }
                        }
                    }
                    Card {
                        Text("AWAKE NOW").font(.system(size: 10, weight: .bold)).tracking(1).foregroundStyle(EkkoPalette.muted).padding(.bottom, 10)
                        Text("Your \(appCount) selected \(appCount == 1 ? "app is" : "apps are") available for today.")
                            .font(.system(size: 14, weight: .semibold)).foregroundStyle(EkkoPalette.ink)
                    }
                    Button(action: onCircle) {
                        HStack(spacing: 11) {
                            Image(systemName: "sun.max.fill").foregroundStyle(EkkoPalette.ember)
                            Text("Your morning is yours. Check your circle for friends who shared today.").font(.system(size: 13)).foregroundStyle(EkkoPalette.ink)
                            Spacer()
                            Image(systemName: "chevron.right").font(.system(size: 12, weight: .bold)).foregroundStyle(EkkoPalette.muted)
                        }.padding(14).background(EkkoPalette.card, in: RoundedRectangle(cornerRadius: 18)).overlay(RoundedRectangle(cornerRadius: 18).stroke(EkkoPalette.border, lineWidth: 1))
                    }.buttonStyle(.plain)
                    Button(action: onCircle) {
                        Text("Cheer on your circle").font(.system(size: 16, weight: .semibold)).foregroundStyle(.white).frame(maxWidth: .infinity).frame(height: 54).background(EkkoPalette.moss, in: RoundedRectangle(cornerRadius: 15))
                    }.buttonStyle(.plain)
                    Button("Back to today", action: backToday).font(.system(size: 14, weight: .semibold)).foregroundStyle(EkkoPalette.moss).padding(.vertical, 9)
                }.padding(.horizontal, 18).padding(.top, 18).padding(.bottom, 30)
            }
        }.background(Color(hex: 0xFBF0CF).ignoresSafeArea())
    }
}

private struct SunriseHero: View {
    let progress: Double
    let appCount: Int
    var awakeToday = false
    var screenTimeReady = false
    let title: String
    let subtitle: String
    var body: some View {
        ZStack(alignment: .bottomLeading) {
            LinearGradient(colors: [EkkoPalette.mossDark, Color(hex: 0x697B58), Color(hex: 0xF0C979)], startPoint: .top, endPoint: .bottom).overlay(alignment: .bottom) {
                Circle().fill(RadialGradient(colors: [EkkoPalette.yolk.opacity(0.95), EkkoPalette.ember.opacity(0.7), .clear], center: .center, startRadius: 12, endRadius: 110))
                    .frame(width: 190, height: 190).offset(x: 190, y: 92 - CGFloat(progress) * 50)
            }
            VStack(alignment: .leading, spacing: 0) {
                SmallPill(text: awakeToday ? "APPS AWAKE FOR TODAY" : screenTimeReady ? "\(appCount) APPS SET TO SLEEP" : "SCREEN TIME NOT ACTIVE", tint: Color.white.opacity(0.15), foreground: .white)
                    .padding(.bottom, 17)
                Text(title).font(.system(size: title.hasPrefix("Good") ? 33 : 32, weight: .bold, design: .rounded)).tracking(-1.3).foregroundStyle(.white)
                Text(subtitle).font(.system(size: title.hasPrefix("Good") ? 33 : 28, weight: .bold, design: .rounded)).tracking(-1.2).foregroundStyle(EkkoPalette.yolk)
            }.padding(.horizontal, 22).padding(.bottom, 25)
        }.frame(height: 295).clipShape(RoundedRectangle(cornerRadius: 0)).accessibilityElement(children: .combine)
    }
}

private struct Card<Content: View>: View {
    let content: Content
    init(@ViewBuilder content: () -> Content) { self.content = content() }
    var body: some View {
        content.padding(14).frame(maxWidth: .infinity, alignment: .leading)
            .background(EkkoPalette.card, in: RoundedRectangle(cornerRadius: 19))
            .overlay(RoundedRectangle(cornerRadius: 19).stroke(EkkoPalette.border.opacity(0.75), lineWidth: 1))
    }
}

private struct AppTile: View {
    let glyph: String
    let tint: Color
    var size: CGFloat = 38
    var dark = false
    var body: some View {
        Text(glyph).font(.system(size: size * 0.32, weight: .bold, design: .rounded))
            .foregroundStyle(dark ? .white : EkkoPalette.ink).frame(width: size, height: size)
            .background(tint, in: RoundedRectangle(cornerRadius: size * 0.31))
            .overlay(alignment: .bottomTrailing) {
                if !dark { Image(systemName: "moon.zzz.fill").font(.system(size: 8, weight: .bold)).foregroundStyle(.white).padding(3).background(EkkoPalette.mossDark, in: Circle()).offset(x: 3, y: 3) }
            }
            .accessibilityHidden(true)
    }
}

private struct SmallPill: View {
    let text: String
    let tint: Color
    let foreground: Color
    var body: some View {
        Text(text).font(.system(size: 9, weight: .bold, design: .rounded)).tracking(0.8).foregroundStyle(foreground)
            .padding(.horizontal, 10).padding(.vertical, 7).background(tint, in: Capsule())
    }
}

private struct TabBar: View {
    @Binding var selection: EkkoTab
    var body: some View {
        HStack(spacing: 0) {
            ForEach(EkkoTab.allCases, id: \.self) { tab in
                Button { selection = tab } label: {
                    VStack(spacing: 5) {
                        Image(systemName: tab.symbol).font(.system(size: 18, weight: .medium))
                        Text(tab.rawValue).font(.system(size: 10, weight: .semibold))
                    }.foregroundStyle(selection == tab ? EkkoPalette.moss : EkkoPalette.muted)
                        .frame(maxWidth: .infinity).frame(height: 58).contentShape(Rectangle())
                }.buttonStyle(.plain).accessibilityAddTraits(selection == tab ? .isSelected : [])
            }
        }.padding(.horizontal, 10).padding(.top, 5).background(.ultraThinMaterial).overlay(alignment: .top) { Rectangle().fill(EkkoPalette.border.opacity(0.8)).frame(height: 0.5) }
    }
}

private struct GhostButton: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label.font(.system(size: 12, weight: .semibold)).foregroundStyle(EkkoPalette.moss)
            .padding(.horizontal, 9).padding(.vertical, 12).opacity(configuration.isPressed ? 0.65 : 1)
    }
}
