# Release readiness

## Development baseline

Use Node 24.18.0 LTS and pnpm 10.4.1. Run `nvm use` if using nvm,
then `pnpm install --frozen-lockfile`. Commit dependency changes with pnpm-lock.yaml.
Generated android/ and ios/ directories are ignored; app.json is the native
configuration source. Do not keep permanent configuration changes only in those
directories.

Run `pnpm run validate` before a build. GitHub Actions runs the same checks on
pushes and pull requests. EAS runs them after installing dependencies. These
checks cover TypeScript, pitch-detector tests, and Expo dependency compatibility;
they do not validate native runtime behavior or store readiness.

## Build profiles

- development: development client with Metro, for local iteration.
- preview: standalone internal build; Android produces an installable APK.
- production: store release; Android produces an AAB. EAS manages build numbers
  remotely and increments them for production builds. Update expo.version and
  package.json version together when changing the public version.

After linking this project to an Expo account with `eas init`, use
`eas build --platform android --profile preview` or
`eas build --platform all --profile production`. Account access and signing
credentials must be configured before these commands can produce signed builds.
No build or submission has been performed as part of this configuration audit.

App configuration changes require regenerating existing native projects and
rebuilding the development client. With no custom native edits to preserve, run
`pnpm exec expo prebuild --clean --platform android`, then `pnpm run android`.

## Android SDK and permissions

The audited debug manifest declares minSdkVersion 24 and targetSdkVersion 36.
These come from the installed Expo / React Native build toolchain. Recheck the
merged release manifest after dependency upgrades and before submission.
Leave app-wide maxSdkVersion unset to allow installation on future Android
versions. Check the applicable Google Play target API requirement at release time.

Microphone permission and audio settings are needed for tuning; vibration is
needed for lock feedback. Legacy external storage permissions are blocked because
this app processes audio in memory. Background playback and recording remain
disabled. Inspect the final release manifest, including transitive permissions,
rather than using the development manifest as the store permission inventory.

## Outstanding release gates

- Supply original app icons, Android adaptive icons, and launch artwork. Current
  config does not specify branded assets.
- Publish a privacy policy and make it accessible in the app, as PRODUCT.md
  requires. Complete Apple privacy and Google Play Data safety disclosures from
  the final binary's actual behavior and dependencies.
- Inspect the generated iOS privacy manifest, required-reason API declarations,
  microphone usage description, and export compliance answers. AsyncStorage
  includes a privacy manifest, but that alone does not validate the full app.
- Review release network security settings. Expo's current generated iOS config
  permits arbitrary network loads and includes development LAN discovery text;
  verify and restrict the final store binary without breaking Metro in development.
- Decide whether system backup of tuning preferences is desired. Android currently
  uses the default allowBackup=true; the app does not persist microphone audio.
- Link EAS to the intended owner/project and configure Android upload signing,
  Apple team/provisioning, and store records. Keep credentials out of Git.
- Test signed preview/release builds without Metro or a network connection. Check
  cold start, microphone permission denial/revocation, background/foreground,
  calls and interruptions, wired audio routes, and recovery after capture errors.
- Measure tuner latency and low-frequency accuracy on physical Android and iOS
  devices, including the minimum supported OS versions. Simulator checks are
  insufficient for audio quality.
- Verify text scaling, screen readers, small screens, and system navigation on
  release builds. Handle rejected asynchronous audio operations and persistence
  errors before calling runtime behavior production-ready.

OTA updates, analytics, crash-reporting services, and new background capabilities
are not configured. Introducing services requires a deliberate product/privacy
decision and an updated release audit.
