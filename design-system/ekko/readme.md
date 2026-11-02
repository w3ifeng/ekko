# ekko Design System

**ekko** is a personal morning-routine app for iOS. At 4:00 am every day it puts your chosen distracting apps (TikTok, Instagram…) to sleep. They wake up once you've ticked off the *required* steps of your morning routine — or you deliberately choose a way out. A small friend circle sees who finished and their streak, nothing more.

The product is pre-implementation. This system turns the existing direction doc + browser concept into an aesthetic, playful visual language and a click-through app kit.

## Sources
- GitHub: https://github.com/w3ifeng/ekko (branch `main`)
  - `README.md` — one-line product definition
  - `docs/product-direction.md` — decided directions (4:00 am boundary, required/optional steps, friends + streaks, no proof) and open questions (override rules, missed mornings, pricing, iOS all-app feasibility)
  - `prototypes/morning-flow.html` — browser concept of the 5-step flow; source of the original palette (`--ink #292f2d`, `--paper #f4f4ef`, `--green #386c5c`, `--mint #e2efe8`, `--orange #d77f4c`), radii and row patterns
- Explore that repo further when designing new flows — the product-direction doc is the source of truth for behaviour.

### Product facts to respect
- Pause starts daily at 4:00 am for selected apps; ends when required steps are done or user overrides.
- Steps are Required or Optional. Completion is self-reported — never imply verification.
- Completing required steps builds the streak; a deliberate full-day skip ends it.
- Friends see completion + current streak only.
- Undecided: temporary override length/allowance, unplanned missed mornings, all-apps-on-wake. Label these as placeholders in designs.

## Index
- `styles.css` — entry point (imports only)
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`
- `components/` — React primitives (see list)
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `ui_kits/ekko-app/` — interactive iOS app recreation (Setup, Today, Shield, Unlocked, Circle)
- `thumbnail.html`, `SKILL.md`, `github.md`

## Components
- **core/** — Button, IconButton, Icon
- **display/** — Sunrise (signature), Card, Pill, AppIcon, Avatar, StreakBadge, ProgressBar
- **forms/** — Switch, Checkbox, Segmented
- **routine/** — TaskRow, AppRow, FriendRow, ChoiceCard
- **navigation/** — TabBar
- **overlay/** — Sheet, Toast

No component library existed in the source, so this is an authored set sized to the app. Intentional additions: **Icon** (wrapper for the Lucide icon font), **Sunrise** (the brand's hero progress motif).

## Content fundamentals
- **Voice:** a warm friend who's a bit cheeky at 6 am. Encouraging, never shaming, never clinical. The prototype's "A softer start, by design" and "Real life happens." set the tone; we push it slightly more playful.
- **Core metaphor:** apps *sleep* and *wake*. Say "TikTok's still asleep", "Wake my apps", "sleeps in until your routine's done" — not "blocked", "locked", "access denied".
- **Person:** second person ("you", "your morning"). ekko rarely says "I/we". Greets by first name ("Good morning, Sam.").
- **Casing:** sentence case everywhere, including buttons. Brand name lowercase **ekko** in UI (repo uses EKKO; the wordmark is lowercase).
- **Length:** titles ≤ 6 words, often two short lines with a full stop ("Morning first. Then the feed."). Body ≤ 2 sentences. Numbers as numerals ("2 steps", "6-day streak", "4:00 am").
- **Costs are stated plainly:** anything that ends a streak says so on the control ("Skip today — ends your 5-day streak").
- **Honesty:** self-report is never dressed up as proof. Undecided rules get a quiet caption, not a promise.
- **Emoji:** not in UI chrome. The prototype used 🔥/✦/🌿; we replaced them with Lucide icons (flame, sparkles). Emoji may appear only in user-written cheers.
- Examples: "What should sleep in until you're up?" · "2 steps till the sun's up" · "All done. Nice one." · "You've got company." · "Cheer sent to Jamie".

## Visual foundations
- **Concept — the day cycle.** The app visually moves from *night* (apps asleep: deep moss `--moss-950/800`) to *sunrise* (yolk + ember) to *day* (warm paper). The **Sunrise** component is the hero: a sun disc rises over a horizon as required steps complete, and the sky blends from moss to dawn.
- **Color:** warm paper backgrounds (`--paper-50/100`), green-tinted ink, moss green for action/selection, ember for streaks, yolk for unlock/celebration. Friend/app tiles use soft paired tints (clay, sky, lilac). One accent per element; no rainbow.
- **Type:** Bricolage Grotesque (display, 750, tight negative tracking −0.045/−0.05em, leading ~1.0); Figtree (body/UI); Instrument Serif *italic* as a one-word accent inside a headline ("Good *morning,* Sam."). Max one serif accent per screen.
- **Spacing:** 4px base; screen padding 18px; rows 11–12px vertical with 1px `#edf0e9` dividers; cards stack with 12px gaps.
- **Backgrounds:** flat paper with a faint dawn radial glow at top-left (`--glow-dawn`, from the prototype). Dark screens get a soft moss radial glow behind the hero. No photos, no patterns, no textures. Gradients only for sky/sun — never decorative purple/blue gradients.
- **Cards:** white `--paper-0`, 1px `#e9ebe4` border, radius 20px, no shadow by default; `raised` adds `--shadow-card`. Variants: soft (mint, no border) for info, night for shield, sunrise for celebration. No colored left-border cards.
- **Corners:** generous — 12px tiles, 14px buttons/choices, 20px cards, 24–32px heroes and sheets, pills fully round. Speech bubbles 16/16/16/4.
- **Shadows:** low and green-tinted (`#2e4233` / `#22352e` at 4–16% alpha). Toasts/sheets use `--shadow-float`. The sun gets a yolk glow.
- **Borders:** 1px warm grey; selected states use 1.5px moss-500 + moss-50 fill; danger selections use danger-600 + danger-100.
- **Hover:** desktop only — buttons step one shade darker; ghost gets a moss-50 wash.
- **Press:** scale to .97 (buttons), .92 (icon buttons), 120ms ease-out.
- **Motion:** springy (`--ease-spring`) for checks, toggles, toasts; slow 1200ms `--ease-sun` for the sky/sun; sheets slide 380ms ease-out. No looping decoration except the sun glow.
- **Transparency & blur:** only the tab bar (frosted `--glass-light/night`) and sheet scrim (`#17241e66`).
- **Imagery:** none yet. If added: warm, soft morning light, slight grain, never stock-glossy.
- **Layout:** iOS, 390pt wide. Status bar on top, fixed frosted tab bar at bottom (Today · Circle · Plan); one full-width primary CTA near the bottom of content.

## Iconography
- **Lucide** via the `lucide-static` icon font from CDN (imported in `tokens/fonts.css`). Use `<Icon name="sun" />` or `<i class="icon-sun"></i>`. 2px rounded line icons, sized 14–24px.
- The source had no icon assets — it used unicode glyphs (◎ ♪ ✉ ✦ ○ ↗) and emoji. **Substitution flagged:** Lucide replaces them.
- Common names: sunrise, sun, moon, moon-star, flame, lock, check, heart, users, list-checks, sparkles, droplets, glass-water, shirt, coffee, timer, flame-kindling.
- Third-party apps are **never** shown with their real logos — `AppIcon` uses a 1–2 letter glyph on a tinted tile, with a "z" badge while asleep.
- No logo exists. The wordmark is "ekko" set in Bricolage Grotesque 800, −0.06em. Do not draw a mark.

## Fonts (substitution)
The prototype used the iOS system stack (SF Pro). Bricolage Grotesque, Figtree and Instrument Serif are loaded from Google Fonts — no font files are bundled.
