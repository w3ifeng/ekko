# EKKO product direction

This note records the latest captain direction for the morning UX prototype. It describes product intent, not implemented app enforcement.

## Decided direction

- **Morning boundary:** Start a daily pause at 4:00 a.m. for the chosen apps. Keep those apps paused until the required routine steps are completed or the user manually overrides.
- **Required and optional steps:** A person can mark routine steps required or optional while creating a plan. Required steps gate completion; optional steps can be omitted.
- **Friends and streaks:** Show friends who completed the daily task, with each friend’s current streak beside their name. Completing the required routine on a day builds the streak; choosing a full-day skip ends it.
- **Proof:** No proof. Routine completion is self-reported; checklist taps do not verify that an activity happened.
- **All apps at wake:** This is only a possible direction if iOS can support it. Do not promise or treat it as an established behavior before feasibility is confirmed.

## Open questions

- What temporary override or recovery behavior should be available, including its duration, allowance, and confirmation steps?
- What happens after an unplanned missed morning when the user did not deliberately choose a full-day skip?
- When should pricing be decided?
- Can iOS support a reliable wake-based all-app pause, and what limits would apply?

The prototype uses illustrative screens and local-only demo state. It does not implement Screen Time controls, app blocking, a backend, or friend accounts.
