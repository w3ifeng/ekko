import SwiftUI

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

private struct RoutineStep: Identifiable {
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

private struct MorningApp: Identifiable {
    let id: String
    let name: String
    let glyph: String
    let tint: Color
    var selected: Bool
}

private struct Friend: Identifiable {
    let id: String
    let name: String
    let initial: String
    let tint: Color
    let streak: Int
    var done: Bool
    let time: String?
    var cheered = false
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
    @State private var selectedTab: EkkoTab = .today
    @State private var hasSetUp = false
    @State private var showShield = false
    @State private var showPeek = false
    @State private var showAccessSheet = false
    @State private var accessChoice = "peek"
    @State private var showCelebration = false
    @State private var streak = 5
    @State private var streakEnded = false
    @State private var didWake = false
    @State private var sharing = true
    @State private var notice: String?
    @State private var steps = [
        RoutineStep("Brush teeth", "About 2 min", "drop.fill", required: true),
        RoutineStep("Glass of water", "Before coffee", "waterbottle.fill", required: true),
        RoutineStep("Get ready", "Take your time", "tshirt.fill", required: true),
        RoutineStep("Skincare", "Skip if you like", "sparkles", required: false)
    ]
    @State private var apps = [
        MorningApp(id: "instagram", name: "Instagram", glyph: "Ig", tint: EkkoPalette.clay, selected: true),
        MorningApp(id: "tiktok", name: "TikTok", glyph: "Tt", tint: EkkoPalette.sky, selected: true),
        MorningApp(id: "youtube", name: "YouTube", glyph: "Yt", tint: EkkoPalette.lilac, selected: false),
        MorningApp(id: "mail", name: "Mail", glyph: "Ma", tint: EkkoPalette.mint, selected: false)
    ]
    @State private var friends = [
        Friend(id: "jamie", name: "Jamie", initial: "J", tint: EkkoPalette.clay, streak: 6, done: true, time: "6:31"),
        Friend(id: "alex", name: "Alex", initial: "A", tint: EkkoPalette.sky, streak: 3, done: true, time: "6:48"),
        Friend(id: "mo", name: "Mo", initial: "M", tint: EkkoPalette.lilac, streak: 11, done: false, time: nil),
        Friend(id: "riya", name: "Riya", initial: "R", tint: EkkoPalette.mint, streak: 0, done: false, time: nil)
    ]

    private var requiredCount: Int { steps.filter(\.required).count }
    private var requiredDone: Int { steps.filter { $0.required && $0.done }.count }
    private var allRequiredDone: Bool { requiredCount > 0 && requiredDone == requiredCount }

    var body: some View {
        ZStack(alignment: .top) {
            EkkoPalette.paper.ignoresSafeArea()
            if !hasSetUp {
                PlanScreen(apps: $apps, steps: $steps, setup: true) {
                    hasSetUp = true
                    selectedTab = .today
                    toast("See you at 4:00 am")
                }
            } else if showShield {
                ShieldPreview(steps: steps, peek: showPeek) {
                    showShield = false
                    showPeek = false
                }
            } else if showCelebration {
                UnlockedScreen(apps: apps, friends: friends, streak: streak) {
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
                        TodayScreen(steps: $steps, apps: apps, streak: streak, streakEnded: streakEnded,
                                    done: allRequiredDone, didWake: didWake,
                                    onWake: {
                                        guard allRequiredDone, !streakEnded, !didWake else { return }
                                        didWake = true
                                        streak += 1
                                        showCelebration = true
                                    }, onAccess: { showAccessSheet = true }, onShield: {
                                        showShield = true
                                        showPeek = false
                                    })
                    case .circle:
                        CircleScreen(friends: $friends, sharing: $sharing) { toast("Cheer sent to \($0)") }
                    case .plan:
                        PlanScreen(apps: $apps, steps: $steps, setup: false) {
                            selectedTab = .today
                            toast("Plan saved for tomorrow")
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
        .sheet(isPresented: $showAccessSheet) {
            AccessSheet(choice: $accessChoice, streak: streak) { choice in
                showAccessSheet = false
                if choice == "skip" {
                    streakEnded = true
                    streak = 0
                    toast("Skipped today. Fresh start tomorrow.")
                } else {
                    showPeek = true
                    showShield = true
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
}

private struct PlanScreen: View {
    @Binding var apps: [MorningApp]
    @Binding var steps: [RoutineStep]
    let setup: Bool
    let onSave: () -> Void

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                HStack {
                    Text("ekko").font(.system(size: 26, weight: .heavy, design: .rounded)).tracking(-1.5).foregroundStyle(EkkoPalette.moss)
                    Spacer()
                    Text(setup ? "YOUR FIRST MORNING" : "CHANGES START TOMORROW")
                        .font(.system(size: 10, weight: .bold, design: .rounded)).tracking(1.1)
                        .foregroundStyle(EkkoPalette.muted)
                }.padding(.bottom, 20)
                Text("What should sleep in until you’re up?")
                    .font(.system(size: 31, weight: .bold, design: .rounded)).tracking(-1.1)
                    .foregroundStyle(EkkoPalette.ink).fixedSize(horizontal: false, vertical: true)
                Text("Your selected apps doze off at 4:00 every morning and wake up when your required steps are done.")
                    .font(.system(size: 15)).foregroundStyle(EkkoPalette.muted).lineSpacing(3).padding(.top, 8).padding(.bottom, 20)
                Card {
                    VStack(spacing: 0) {
                        ForEach(apps.indices, id: \.self) { index in
                            HStack(spacing: 12) {
                                AppTile(glyph: apps[index].glyph, tint: apps[index].tint)
                                Text(apps[index].name).font(.system(size: 16, weight: .semibold)).foregroundStyle(EkkoPalette.ink)
                                Spacer(minLength: 4)
                                Toggle("Pause \(apps[index].name)", isOn: $apps[index].selected).labelsHidden().tint(EkkoPalette.moss)
                                    .accessibilityLabel("Include \(apps[index].name) in morning pause")
                            }.padding(.vertical, 9)
                            if index != apps.count - 1 { Divider().overlay(EkkoPalette.border).padding(.leading, 50) }
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
                    Text("Lights out at 4:00 am. Selected apps stay asleep until your required steps are done.")
                        .font(.system(size: 13)).foregroundStyle(EkkoPalette.mossDark).fixedSize(horizontal: false, vertical: true)
                }.padding(15).frame(maxWidth: .infinity, alignment: .leading).background(EkkoPalette.mint, in: RoundedRectangle(cornerRadius: 18)).padding(.top, 14)
                Button(action: onSave) {
                    HStack { Spacer(); Text(setup ? "Save my morning" : "Save plan"); Spacer(); Image(systemName: "arrow.right") }
                        .font(.system(size: 16, weight: .semibold)).foregroundStyle(.white).padding(.horizontal, 18).frame(height: 54)
                        .background(EkkoPalette.moss, in: RoundedRectangle(cornerRadius: 15))
                }.buttonStyle(.plain)
                    .disabled(!apps.contains(where: \.selected) || !steps.contains(where: \.required))
                    .opacity(apps.contains(where: \.selected) && steps.contains(where: \.required) ? 1 : 0.45)
                    .padding(.top, 18).padding(.bottom, 25)
            }.padding(.horizontal, 18).padding(.top, 14)
        }.background(EkkoPalette.paper.ignoresSafeArea())
    }
}

private struct TodayScreen: View {
    @Binding var steps: [RoutineStep]
    let apps: [MorningApp]
    let streak: Int
    let streakEnded: Bool
    let done: Bool
    let didWake: Bool
    let onWake: () -> Void
    let onAccess: () -> Void
    let onShield: () -> Void
    private var count: Int { steps.filter(\.required).count }
    private var checked: Int { steps.filter { $0.required && $0.done }.count }
    private var remaining: Int { count - checked }

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                SunriseHero(progress: count == 0 ? 0 : Double(checked) / Double(count), appCount: apps.filter(\.selected).count, title: "Good morning,", subtitle: "Sam.")
                    .padding(.horizontal, 0)
                VStack(alignment: .leading, spacing: 0) {
                    HStack(alignment: .center) {
                        Text(didWake ? "Apps are awake. Nice one." : done ? "All done. Nice one." : remaining == 1 ? "One more step" : "\(remaining) steps till the sun’s up")
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
                        HStack(spacing: 9) { Image(systemName: done ? "sunrise.fill" : "lock.fill"); Text(didWake ? "Apps are awake" : done ? "Wake my apps" : "\(remaining) to go") }
                            .font(.system(size: 16, weight: .semibold)).foregroundStyle(done && !streakEnded ? EkkoPalette.ink : .white)
                            .frame(maxWidth: .infinity).frame(height: 54)
                            .background(done && !streakEnded ? EkkoPalette.yolk : EkkoPalette.moss.opacity(streakEnded ? 0.45 : 1), in: RoundedRectangle(cornerRadius: 15))
                    }.buttonStyle(.plain).disabled(!done || streakEnded || didWake).padding(.top, 15)
                    HStack(spacing: 2) {
                        Button("Need access now?", action: onAccess).buttonStyle(GhostButton())
                        Button("Preview the shield", action: onShield).buttonStyle(GhostButton())
                    }.frame(maxWidth: .infinity).padding(.top, 2).padding(.bottom, 25)
                    Text("Selected apps: \(apps.filter(\.selected).map(\.name).joined(separator: ", "))")
                        .font(.system(size: 11)).foregroundStyle(EkkoPalette.muted).lineLimit(2).padding(.bottom, 8)
                }.padding(.horizontal, 18).padding(.top, 18)
            }
        }.background(EkkoPalette.paper.ignoresSafeArea())
    }
}

private struct CircleScreen: View {
    @Binding var friends: [Friend]
    @Binding var sharing: Bool
    let onCheer: (String) -> Void
    private var finished: [Int] { friends.indices.filter { friends[$0].done } }
    private var resting: [Int] { friends.indices.filter { !friends[$0].done } }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                Text("YOUR CIRCLE").font(.system(size: 11, weight: .bold)).tracking(1.3).foregroundStyle(EkkoPalette.muted).padding(.top, 16)
                Text("You’ve got company.").font(.system(size: 31, weight: .bold, design: .rounded)).tracking(-0.9).foregroundStyle(EkkoPalette.ink).padding(.top, 8)
                Text("\(finished.count) of \(friends.count) friends are up and done.").font(.system(size: 15)).foregroundStyle(EkkoPalette.muted).padding(.top, 6).padding(.bottom, 20)
                section("Up and done", rows: finished, done: true)
                section("Still snoozing", rows: resting, done: false)
                HStack(spacing: 12) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Share my mornings").font(.system(size: 14, weight: .bold)).foregroundStyle(EkkoPalette.mossDark)
                        Text("Friends see if you finished and your streak. Never your apps or your list.").font(.system(size: 12)).foregroundStyle(EkkoPalette.secondary).fixedSize(horizontal: false, vertical: true)
                    }
                    Spacer(minLength: 0)
                    Toggle("Share my mornings", isOn: $sharing).labelsHidden().tint(EkkoPalette.moss).accessibilityLabel("Share my mornings")
                }.padding(15).background(EkkoPalette.mint, in: RoundedRectangle(cornerRadius: 18)).padding(.top, 2)
                Button {} label: {
                    Label("Invite a friend", systemImage: "person.badge.plus").font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(EkkoPalette.moss).frame(maxWidth: .infinity).frame(height: 50)
                        .background(EkkoPalette.card, in: RoundedRectangle(cornerRadius: 15)).overlay(RoundedRectangle(cornerRadius: 15).stroke(EkkoPalette.border, lineWidth: 1))
                }.buttonStyle(.plain).padding(.top, 14).padding(.bottom, 25)
            }.padding(.horizontal, 18)
        }.background(EkkoPalette.paper.ignoresSafeArea())
    }

    @ViewBuilder private func section(_ title: String, rows: [Int], done: Bool) -> some View {
        Text(title).font(.system(size: 12, weight: .medium)).foregroundStyle(EkkoPalette.muted).padding(.leading, 2).padding(.bottom, 8)
        Card {
            if rows.isEmpty {
                Text(done ? "No one's up just yet." : "Everyone's up. Nice work.").font(.system(size: 13)).foregroundStyle(EkkoPalette.muted).padding(.vertical, 12)
            } else {
                VStack(spacing: 0) {
                    ForEach(rows, id: \.self) { friendIndex in
                        HStack(spacing: 11) {
                            Circle().fill(friends[friendIndex].tint).frame(width: 40, height: 40)
                                .overlay(Text(friends[friendIndex].initial).font(.system(size: 15, weight: .bold)).foregroundStyle(EkkoPalette.ink))
                            VStack(alignment: .leading, spacing: 3) {
                                Text(friends[friendIndex].name).font(.system(size: 14, weight: .semibold)).foregroundStyle(EkkoPalette.ink)
                                Text(done ? "Done at \(friends[friendIndex].time ?? "6:30")" : "Hasn’t started yet").font(.system(size: 11)).foregroundStyle(EkkoPalette.muted)
                            }
                            Spacer(minLength: 3)
                            Label("\(friends[friendIndex].streak)", systemImage: "flame.fill").font(.system(size: 11, weight: .bold)).foregroundStyle(EkkoPalette.ember)
                            Button {
                                friends[friendIndex].cheered.toggle()
                                if friends[friendIndex].cheered { onCheer(friends[friendIndex].name) }
                            } label: {
                                Image(systemName: friends[friendIndex].cheered ? "heart.fill" : "heart")
                                    .font(.system(size: 15, weight: .medium)).foregroundStyle(friends[friendIndex].cheered ? EkkoPalette.ember : EkkoPalette.muted)
                                    .frame(width: 38, height: 38).contentShape(Rectangle())
                            }.buttonStyle(.plain).accessibilityLabel("Encourage \(friends[friendIndex].name)")
                        }.padding(.vertical, 9)
                        if friendIndex != rows.last { Divider().overlay(EkkoPalette.border).padding(.leading, 51) }
                    }
                }
            }
        }.padding(.bottom, 16)
    }
}

private struct AccessSheet: View {
    @Binding var choice: String
    let streak: Int
    let onContinue: (String) -> Void
    @Environment(\.dismiss) private var dismiss
    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Real life happens.").font(.system(size: 27, weight: .bold, design: .rounded)).foregroundStyle(EkkoPalette.ink).padding(.top, 18)
            Text("Pick a way out. No judgement — just know what each one costs.").font(.system(size: 14)).foregroundStyle(EkkoPalette.muted)
            HStack(spacing: 9) {
                choiceCard(id: "peek", title: "5-minute peek", info: "Apps nap again after. Streak safe.", symbol: "timer")
                choiceCard(id: "skip", title: "Skip today", info: "Ends your \(streak)-day streak.", symbol: "flame")
            }.frame(maxHeight: .infinity)
            Button { onContinue(choice) } label: {
                Text(choice == "skip" ? "Skip today" : "Start my 5 minutes").font(.system(size: 16, weight: .semibold)).foregroundStyle(.white).frame(maxWidth: .infinity).frame(height: 52)
                    .background(choice == "skip" ? Color(hex: 0xB4483A) : EkkoPalette.moss, in: RoundedRectangle(cornerRadius: 15))
            }.buttonStyle(.plain)
            Text("Peek length and daily allowance are still being decided.").font(.system(size: 11)).foregroundStyle(EkkoPalette.muted).frame(maxWidth: .infinity).padding(.bottom, 10)
        }.padding(.horizontal, 20).background(EkkoPalette.paper.ignoresSafeArea())
    }
    private func choiceCard(id: String, title: String, info: String, symbol: String) -> some View {
        Button { choice = id } label: {
            VStack(alignment: .leading, spacing: 8) {
                Image(systemName: symbol).font(.system(size: 18)).foregroundStyle(id == "skip" ? Color(hex: 0xB4483A) : EkkoPalette.moss)
                Text(title).font(.system(size: 14, weight: .bold)).foregroundStyle(EkkoPalette.ink)
                Text(info).font(.system(size: 11)).foregroundStyle(EkkoPalette.muted).multilineTextAlignment(.leading)
                Spacer(minLength: 0)
                if choice == id { Image(systemName: "checkmark.circle.fill").foregroundStyle(id == "skip" ? Color(hex: 0xB4483A) : EkkoPalette.moss) }
            }.frame(maxWidth: .infinity, alignment: .leading).frame(height: 118).padding(12)
                .background(id == "skip" ? Color(hex: 0xF6E1DC) : EkkoPalette.mint, in: RoundedRectangle(cornerRadius: 14))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(choice == id ? (id == "skip" ? Color(hex: 0xB4483A) : EkkoPalette.moss) : EkkoPalette.border, lineWidth: choice == id ? 1.5 : 1))
        }.buttonStyle(.plain).accessibilityAddTraits(choice == id ? .isSelected : [])
    }
}

private struct ShieldPreview: View {
    let steps: [RoutineStep]
    let peek: Bool
    let onBack: () -> Void
    var body: some View {
        VStack(spacing: 0) {
            Spacer()
            if peek {
                Text("4:59").font(.system(size: 76, weight: .bold, design: .rounded)).tracking(-4).foregroundStyle(EkkoPalette.yolk)
                Text("Peek preview. Selected apps would return to sleep when the time is up.")
                    .font(.system(size: 16)).foregroundStyle(Color(hex: 0xC9DACF)).multilineTextAlignment(.center).padding(.top, 12).frame(maxWidth: 290)
            } else {
                AppTile(glyph: "Tt", tint: EkkoPalette.mossDark, size: 78, dark: true).padding(.bottom, 22)
                SmallPill(text: "SHIELD PREVIEW", tint: Color.white.opacity(0.12), foreground: Color(hex: 0xC9DACF))
                Text("TikTok’s still\nasleep.").font(.system(size: 38, weight: .bold, design: .rounded)).tracking(-1.1).multilineTextAlignment(.center).foregroundStyle(.white).padding(.top, 18)
                let left = steps.filter { $0.required && !$0.done }
                Text(left.isEmpty ? "Your routine’s done. Return to ekko to continue." : "\(left.count) required \(left.count == 1 ? "step" : "steps") left: \(left.map { $0.title.lowercased() }.joined(separator: ", ")).")
                    .font(.system(size: 15)).foregroundStyle(Color(hex: 0xC9DACF)).multilineTextAlignment(.center).padding(.top, 12).frame(maxWidth: 290)
            }
            Spacer()
            Button(action: onBack) {
                Text(peek ? "End preview" : "Open my routine").font(.system(size: 16, weight: .semibold)).foregroundStyle(EkkoPalette.mossDeep)
                    .frame(maxWidth: .infinity).frame(height: 54).background(EkkoPalette.card, in: RoundedRectangle(cornerRadius: 15))
            }.buttonStyle(.plain)
            Text("Illustrative preview only. No app blocking or Screen Time enforcement is active.").font(.system(size: 11)).foregroundStyle(.white.opacity(0.55)).multilineTextAlignment(.center).padding(.top, 14)
        }.padding(.horizontal, 24).padding(.top, 60).padding(.bottom, 34).frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(RadialGradient(colors: [EkkoPalette.moss, EkkoPalette.mossDeep], center: .center, startRadius: 25, endRadius: 470).ignoresSafeArea())
    }
}

private struct UnlockedScreen: View {
    let apps: [MorningApp]
    let friends: [Friend]
    let streak: Int
    let onCircle: () -> Void
    let backToday: () -> Void
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                SunriseHero(progress: 1, appCount: apps.filter(\.selected).count, title: "Morning first.", subtitle: "Then the feed.")
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
                        ForEach(apps.filter(\.selected)) { app in HStack(spacing: 9) { AppTile(glyph: app.glyph, tint: app.tint, size: 32); Text(app.name).font(.system(size: 14, weight: .semibold)).foregroundStyle(EkkoPalette.ink) }.padding(.vertical, 3) }
                    }
                    Button(action: onCircle) {
                        HStack(spacing: 11) {
                            HStack(spacing: -7) { ForEach(friends.filter(\.done).prefix(3)) { friend in Circle().fill(friend.tint).frame(width: 32, height: 32).overlay(Text(friend.initial).font(.system(size: 12, weight: .bold))).overlay(Circle().stroke(.white, lineWidth: 2)) } }
                            Text("\(friends.filter(\.done).map(\.name).joined(separator: " & ")) are up too.").font(.system(size: 13)).foregroundStyle(EkkoPalette.ink)
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
    let title: String
    let subtitle: String
    var body: some View {
        ZStack(alignment: .bottomLeading) {
            LinearGradient(colors: [EkkoPalette.mossDark, Color(hex: 0x697B58), Color(hex: 0xF0C979)], startPoint: .top, endPoint: .bottom).overlay(alignment: .bottom) {
                Circle().fill(RadialGradient(colors: [EkkoPalette.yolk.opacity(0.95), EkkoPalette.ember.opacity(0.7), .clear], center: .center, startRadius: 12, endRadius: 110))
                    .frame(width: 190, height: 190).offset(x: 190, y: 92 - CGFloat(progress) * 50)
            }
            VStack(alignment: .leading, spacing: 0) {
                SmallPill(text: progress >= 1 ? "APPS CAN WAKE UP" : "\(appCount) APPS ASLEEP SINCE 4:00", tint: Color.white.opacity(0.15), foreground: .white)
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
