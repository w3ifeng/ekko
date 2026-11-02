# ekko for iPhone

Open [Ekko.xcodeproj](Ekko.xcodeproj) in Xcode and run the `Ekko` scheme on an iPhone simulator or device. Routine setup and progress work locally without an account. Email OTP sign-in and Circle sharing become available after setting `EK_SUPABASE_URL` and `EK_SUPABASE_PUBLISHABLE_KEY` in the run configuration or build settings.

Circle uses the checked-in Supabase migrations for profiles, invitations, sharing consent, and the completion feed; it shows an empty/join/invite state until real shared data exists. Email codes require the Supabase Magic Link template to include `{{ .Token }}` and a configured sender for hosted use. See [backend setup](../docs/backend-setup.md) for local configuration and hosted launch inputs.

Native Apple sign-in is available behind `EK_APPLE_SIGN_IN_ENABLED` and defaults off. Apple Developer membership, the app capability and provisioning profile, plus Supabase Apple provider configuration are required to enable it. Routine steps, app selections, and enforcement state stay on-device. The shield uses Family Controls, Managed Settings, and the Device Activity monitor extension. The visual source kit is preserved in [design-system/ekko](../design-system/ekko).

Device use requires Family Controls and App Groups to be provisioned for the app and monitor extension. A simulator build checks compilation only; it does not verify that iOS is enforcing a shield. Physical-device enforcement has not yet been verified for this project.
