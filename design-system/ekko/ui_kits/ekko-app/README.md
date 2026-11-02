# ekko app — UI kit

Interactive click-through of the ekko iOS app, built from the flow in `w3ifeng/ekko/prototypes/morning-flow.html` (setup → morning → shield → friends → exception) and re-styled with this design system.

Screens
- **SetupScreen** — choose apps that "sleep in", mark steps Required / Optional, 4:00 am boundary. Reused as the **Plan** tab (edits apply tomorrow).
- **TodayScreen** — Sunrise hero rises as required steps are ticked; "Need access now?" opens the exception Sheet (5-minute peek vs. skip today).
- **ShieldScreen** — what you see opening a paused app (illustrative; real iOS enforcement unverified). Also renders the peek countdown.
- **UnlockedScreen** — sunrise celebration, streak +1, apps awake, friends who are up.
- **CircleScreen** — friends who finished + streaks, cheer button, sharing switch.

Changes vs. the source prototype (intentional, per user's invitation to challenge the front end)
- Dropped all explainer/caveat copy from in-app screens; kept one short caveat on the Shield and the peek sheet.
- "Exception" became a bottom sheet off Today, not a destination screen.
- Added a tab bar (Today / Circle / Plan) so the app has a home after setup.
- Encouragement moved from a single "send note" button to per-friend cheer buttons.
- Peek duration (5 min) is a placeholder — the product doc lists override rules as undecided.
