# EKKO local Supabase backend

This is a setup and operating guide for the native Supabase client. The repository contains the Auth/REST client and local migrations, but no hosted Supabase project. The migrations have not been applied and the local backend has not been started. This guide does not create a hosted project or deploy anything.

## What belongs in the backend

Supabase Auth and Postgres with row-level security (RLS) provide authenticated identities and enforce access to the small amount of data needed for optional friend sharing. RLS should scope reads and writes to the signed-in user and the groups they belong to; clients must not rely on UI checks for access control.

Keep routines, private step names, schedules, selected apps and their control tokens, gate state, and personal completion history on the device. The backend stores only sharing data and the daily outcome needed for a friend feed. The checked-in local schema consists of:

- `profiles` for a display name and sharing-consent state;
- `groups` and group memberships for friend circles;
- invitations stored as hashes, with an expiry, rather than reusable plaintext invitation secrets;
- idempotent daily outcomes, one per user and local date, with `completed` or `skipped` as the outcome.

The friend feed should return only opted-in group members who completed on their own local date, along with their display name and current streak. It must not reveal skipped or absent days as feed entries, routine details, private steps, schedules, app selections, or app-control tokens.

Streak behavior is based on explicit outcomes: a completed outcome increments the streak; an in-app Skip writes a skipped outcome and resets it. If someone does not open or use EKKO, no outcome row is written and the streak is unchanged. A missing row is not a skip.

## Local prerequisites and workflow

Local Supabase development requires the Supabase CLI and a running Docker-compatible runtime. Follow Supabase's [CLI installation guide](https://supabase.com/docs/guides/local-development/cli/getting-started) for the supported setup for your machine. Supabase's local development workflow is [documented here](https://supabase.com/docs/guides/local-development/cli-workflows). These commands start the local stack and apply migrations; the local backend has not been started in this workspace.

From the repository root, when you are ready to start the local Supabase stack:

```sh
supabase start
supabase status
supabase stop
```

After `supabase start`, read the local API URL and publishable `anon` key from `supabase status`. Supply them to Xcode as build settings; they are intentionally not stored in the project:

```sh
xcodebuild -project ios/Ekko.xcodeproj -scheme Ekko -destination 'platform=iOS Simulator,name=<installed iPhone simulator>' \
  EK_SUPABASE_URL=http://127.0.0.1:54321 EK_SUPABASE_PUBLISHABLE_KEY='<local-anon-key>' build
```

Use the actual simulator name installed on your machine. A publishable/anon key is designed for client use and is safe to ship when RLS is enabled. Never use a secret or service-role key in Xcode or the app. The app stores its refreshable Auth session in the iOS Keychain; routine content and Screen Time settings remain on-device.

`start` brings up the local stack and applies migrations and seed data; `stop` stops it while preserving local database data. To discard and recreate the local database from the checked-in migration chain and seed data, use:

```sh
supabase db reset --local
```

For a schema change, create a migration, edit and review its SQL, then reset locally to verify the full migration chain:

```sh
supabase migration new describe_the_change
supabase db reset --local
```

`db reset` is destructive to the database it targets. Keep `--local` explicit for local work. Do not use `--linked` or any remote-targeting command as part of routine local setup. Keep migration files and safe configuration in version control; keep credentials out of the repository. The local stack is for development only: it has development defaults and is not hardened for production. Never expose it to public or external traffic.

## Future hosted project

No hosted project exists for this task. A hosted project should be linked and migrated only after its owner creates it and explicitly authorizes deployment. After that authorization, an operator can authenticate the CLI, link the project using its project reference, inspect the linked target, and apply reviewed migrations:

```sh
supabase login
supabase link --project-ref <owner-provided-project-ref>
supabase projects list
supabase migration list
supabase db push
```

`db push` applies pending local migrations to the linked remote project; it changes hosted state. Do not run it without the owner's authorization. Never use `supabase db reset --linked` on a production project: it drops the linked schema and rebuilds it from migrations. See the official [local development workflow](https://supabase.com/docs/guides/local-development/cli-workflows) and [database migrations guide](https://supabase.com/docs/guides/local-development/database-migrations) for command behavior.

The mobile app may contain a Supabase publishable key because it is designed for client use; access must still be constrained by Auth and RLS. A secret/service-role key bypasses RLS and belongs only in a trusted server environment. Never put one in an iOS app, source control, or a client build. See [Supabase API key guidance](https://supabase.com/docs/guides/getting-started/api-keys).

## Auth, invitations, and consent boundaries

Require authentication for sharing actions. Users should opt in before their profile appears in the friend feed and be able to leave a group or turn sharing off. Invitations should be random, single-purpose, time-limited, and stored server-side only as hashes; redeeming one should be authenticated and should not grant access beyond joining its group. RLS should prevent reading other groups or unshared profiles.

Account deletion should remove or detach the user's profile, memberships, invitations they own, and daily outcomes according to the product's retention policy; provide a deliberate deletion path and do not keep sharing data after deletion without a documented reason. Do not upload routines, routine steps, schedules, app selections, app-control tokens, or gate state.

Email sign-in uses Supabase Auth's email OTP endpoints. To deliver a numeric one-time code, the hosted project's Magic Link email template must contain `{{ .Token }}` (for example, “Your ekko sign-in code is {{ .Token }}”). See Supabase's [passwordless email guide](https://supabase.com/docs/guides/auth/auth-email-passwordless) and [custom SMTP guide](https://supabase.com/docs/guides/auth/auth-smtp). Supabase's default email sender is rate-limited for testing; a real-user launch needs an owner-configured SMTP provider and verified sender domain in Supabase. Provide the Supabase project URL and publishable key to the app as build settings. No SMTP credentials belong in this repository or app.

Sign in with Apple is implemented behind the `EK_APPLE_SIGN_IN_ENABLED` build setting, which defaults off. Enabling it requires a paid Apple Developer Program membership to turn on the Sign in with Apple capability for the `com.ekko.morning` App ID and provision a matching development/distribution profile. The owner must also configure Apple's provider in Supabase Auth using the [native Apple setup](https://supabase.com/docs/guides/auth/social-sign-in/auth-apple) and the Apple identifiers/key material Supabase requests. Without those steps, email OTP continues to work and the Apple button stays hidden. This task has not changed Apple or Supabase account settings.

## Owner inputs for hosted launch

- Supabase project URL and publishable key, plus approval to apply the reviewed migrations to that project.
- Custom SMTP host, port, username, password, verified sender address/domain, and the numeric-code email template.
- If Apple sign-in is desired: paid Apple Developer membership, the app capability and profiles, and the Apple identifiers/key material needed for Supabase's Apple provider.
- A distribution decision and Apple Developer membership for TestFlight or App Store delivery.

## iOS distribution

Setting up a backend does not let friends install the iOS app. TestFlight distribution requires Apple Developer Program membership, which is not currently planned for EKKO. See [Apple Developer Program membership details](https://developer.apple.com/programs/whats-included/) and [TestFlight](https://developer.apple.com/testflight/).
