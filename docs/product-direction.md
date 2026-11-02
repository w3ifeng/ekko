# EKKO product direction

This note records the latest captain direction for the morning UX prototype. It describes product intent, not implemented app enforcement.

## Decided direction

- **Morning boundary:** Start a daily pause at 4:00 a.m. for the chosen apps. Keep those apps paused until the required routine steps are completed or the user manually overrides.
- **Required and optional steps:** A person can mark routine steps required or optional while creating a plan. Required steps gate completion; optional steps can be omitted.
- **Friends and streaks:** Show opted-in friends who completed on their own local date, with each friend’s current streak beside their name. Each completed daily outcome adds one to the streak; an explicit Skip outcome resets it. A date with no app activity creates no outcome and leaves the streak unchanged. A friend feed must not expose skipped status or routine, schedule, app-selection, app-blocking, or usage details.
- **Proof:** No proof. Routine completion is self-reported; checklist taps do not verify that an activity happened.
- **All apps at wake:** This is only a possible direction if iOS can support it. Do not promise or treat it as an established behavior before feasibility is confirmed.

## Open questions

- What temporary override or recovery behavior should be available, including its duration, allowance, and confirmation steps?
- When should pricing be decided?
- Can iOS support a reliable wake-based all-app pause, and what limits would apply?

The prototype uses illustrative screens and local-only demo state. It does not implement Screen Time controls, app blocking, a backend, or friend accounts.

The Supabase database foundation is being prepared separately as local migrations. These files have not been applied to a database.
