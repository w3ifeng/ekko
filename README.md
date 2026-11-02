# EKKO

EKKO is a personal morning routine app that delays access to distracting apps until the routine is complete.

This repository is a local starter for product research and technical planning.

## Product direction and prototype

The current product direction and unresolved choices are documented in [docs/product-direction.md](docs/product-direction.md). The interactive [morning flow prototype](prototypes/morning-flow.html) explores the setup, routine, friend, and recovery experience. It is a browser concept only; it does not block apps on a phone.

The iOS app includes local-first routine setup and Supabase email-code authentication for optional Circle sharing. Circle data comes from the checked-in profile, group, invitation, and completion-feed migrations; no sample friends are shown. The local backend setup and hosted launch inputs are in [docs/backend-setup.md](docs/backend-setup.md). Migrations have not been applied to a hosted project, and no hosted project is configured.
