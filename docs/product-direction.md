# EKKO product direction

This note records the latest captain direction for the morning UX prototype. It describes product intent, not implemented app enforcement.

## Decided direction

- **Morning boundary:** Start a daily pause at 5:00 a.m. for the apps the user chooses. Keep those apps paused until the required routine steps are completed, the user uses their one short unlock, or the user chooses a full-day Skip.
- **Required and optional steps:** A person can mark routine steps required or optional while creating a plan. Required steps gate completion; optional steps can be omitted.
- **Short unlock:** Allow one 10-minute unlock per EKKO day. It does not break the streak.
- **Full-day Skip:** Let the user unlock their selected apps for the rest of the day. Skip ends the current streak.
- **Incomplete mornings:** If the required steps remain incomplete all day, keep the selected apps paused and preserve the streak. Do not automatically unlock apps or break the streak. Only finishing the required steps or choosing Skip changes that state.
- **Friends and streaks:** Show friends who completed the daily task, with each friend’s current streak beside their name. Completing the required routine on a day builds the streak; choosing a full-day Skip ends it.
- **Proof:** No proof. Routine completion is self-reported; checklist taps do not verify that an activity happened.
- **Pricing:** EKKO is free for now.
- **Enforcement:** The app selection screen shows the user's intended choice of apps. Do not claim iOS Screen Time or app-blocking enforcement has been verified or implemented.

## Open questions

- What happens after an unplanned missed morning when the user did not deliberately choose a full-day skip?
- What limits would apply to future iOS enforcement?

The prototype uses illustrative screens and local-only demo state. It does not implement Screen Time controls, app blocking, a backend, or friend accounts.
