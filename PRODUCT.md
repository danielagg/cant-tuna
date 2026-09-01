# cant-tuna product specification

## Product statement

cant-tuna is a free, offline guitar and bass tuner for players who want a fast, precise tool and like a rough punk aesthetic. It opens into the tuner, listens immediately after permission is granted, gives honest pitch information, throws snark at the player, and stays out of the way.

The operating principle is: simple, precise, no commercial garbage.

This specification describes the complete product. Anything listed as excluded is not part of the app.

## Product principles

1. Tuning quality comes first. The visual identity and jokes never hide, delay, or alter the measurement.
2. The tuner is the product. It does not grow into a lessons, tabs, metronome, social, or practice platform.
3. It works without internet access. Audio, presets, custom tunings, preferences, fonts, textures, and copy stay on the device.
4. It does not contain advertisements, subscriptions, purchases, accounts, analytics, or a backend.
5. It assumes most players want six-string Guitar Standard, while keeping extended-range and custom configurations close at hand.
6. Configuration is the only deliberately complex part of the product.

## Audience and positioning

The audience is any guitarist or bassist who likes the aesthetic. Musical experience, genre, and skill level do not restrict the app.

The primary promise is:

> The tuner that opens immediately and actually works.

The punk identity supports that promise. It comes from blunt writing, rough visual materials, and refusal to waste the player's time. The app is not a novelty tuner and does not intentionally relax its accuracy.

The finished app is suitable for a public Apple App Store and Google Play release, but its primary success criterion is portfolio quality and real usefulness to its creator.

## Explicit exclusions

cant-tuna does not include:

- Advertisements or sponsorships
- Payments, subscriptions, or tip jars
- Accounts or profiles
- Analytics or behavioral tracking
- A backend, cloud sync, or remote configuration
- Metronome
- Chord library
- Lessons, songs, or tabs
- Temperament controls
- Adjustable concert pitch
- Practice history or session history
- Social or sharing features
- Themes or visual-style controls
- A simplified or clean visual mode
- Localization beyond English
- Background microphone use
- Landscape-specific layouts

Concert pitch is fixed at A4 = 440 Hz.

## Supported configurations

### Selector hierarchy

The player chooses three things:

1. Instrument family
2. String count
3. Tuning preset

The supported instrument profiles are:

- Guitar: 6, 7, or 8 strings
- Baritone Guitar: 6 strings
- Bass: 4, 5, or 6 strings

The main tuner shows the active configuration in one obvious control, for example `Guitar · 6 strings · Standard`. Tapping it opens a compact selector. Each choice filters the next, so a player only sees applicable tunings.

Six-string Guitar Standard is active on first use. The app saves each selection immediately and restores the most recent instrument profile and tuning on every subsequent launch.

Chromatic is available from the tuning selector. It detects the nearest chromatic note without choosing a target string.

### Built-in tuning presets

All target lists below run from the lowest, thickest string to the highest, thinnest string. Octaves use scientific pitch notation with middle C as C4.

| Instrument profile | Tuning | Targets, low to high |
|---|---|---|
| Guitar · 6 | Standard | E2 A2 D3 G3 B3 E4 |
| Guitar · 6 | E♭ Standard | E♭2 A♭2 D♭3 G♭3 B♭3 E♭4 |
| Guitar · 6 | D Standard | D2 G2 C3 F3 A3 D4 |
| Guitar · 6 | Drop D | D2 A2 D3 G3 B3 E4 |
| Guitar · 6 | Drop C♯ | C♯2 G♯2 C♯3 F♯3 A♯3 D♯4 |
| Guitar · 6 | Drop C | C2 G2 C3 F3 A3 D4 |
| Guitar · 6 | DADGAD | D2 A2 D3 G3 A3 D4 |
| Baritone Guitar · 6 | B Standard | B1 E2 A2 D3 F♯3 B3 |
| Baritone Guitar · 6 | A Standard | A1 D2 G2 C3 E3 A3 |
| Baritone Guitar · 6 | Drop A | A1 E2 A2 D3 F♯3 B3 |
| Guitar · 7 | B Standard | B1 E2 A2 D3 G3 B3 E4 |
| Guitar · 7 | Drop A | A1 E2 A2 D3 G3 B3 E4 |
| Guitar · 8 | F♯ Standard | F♯1 B1 E2 A2 D3 G3 B3 E4 |
| Guitar · 8 | Drop E | E1 B1 E2 A2 D3 G3 B3 E4 |
| Bass · 4 | Standard | E1 A1 D2 G2 |
| Bass · 4 | Drop D | D1 A1 D2 G2 |
| Bass · 5 | Low-B Standard | B0 E1 A1 D2 G2 |
| Bass · 6 | Standard | B0 E1 A1 D2 G2 C3 |

Internally, target pitches use MIDI note numbers or an equivalent unambiguous representation. Display spelling remains conventional, so E♭ Standard uses flats and Drop C♯ uses sharps.

### Custom tunings

Custom tuning is intentionally small and secondary:

1. The player starts from an existing preset.
2. The player changes individual target notes with semitone controls.
3. The player names and saves the result.
4. The custom tuning appears under its source instrument profile.
5. The player can edit, rename, or delete it.

Custom tunings persist only on the device. Creating a blank tuning is not supported.

Each string row has a speaker control. Tapping it plays one short Reference tone for the selected note. Note changes remain silent until the player explicitly taps the speaker. The app stops any previous Reference tone, pauses pitch classification during playback, and resumes listening after the sound tail ends.

Reference tones use bundled audio, including audible harmonics for low bass notes that phone speakers cannot reproduce cleanly as fundamentals. The note name and octave remain visible. Playback never acts as the only confirmation.

If a player raises a string above the copied preset's target, the editor warns that higher pitch increases string tension. The app never tells a player to keep tightening when the detected octave is uncertain.

## Main tuning experience

### Launch and microphone permission

On the first launch, the tuner shell appears immediately with a short explanation:

> cant-tuna needs the mic to hear your string. Audio is analyzed on this phone, never saved, and never sent anywhere.

The system permission prompt follows a player tap on `Turn on the mic`. Once permission has been granted, subsequent launches start listening immediately.

If permission is denied, the app explains that tuning cannot work without the microphone and provides a button to open system settings. It does not repeatedly prompt.

### Main screen

The portrait tuner screen always prioritizes:

- Active instrument, string count, and tuning
- Large Detected note with octave
- Target string when a tuning preset is active
- Signed cents offset
- `FLAT` or `SHARP` direction with a directional arrow
- Centered needle meter
- Tuning verdict

Frequency in hertz and numeric confidence do not remain on the normal screen. Low confidence produces useful states such as `Play a string`, `Too quiet`, or `One string at a time`.

The meter behaves like a battered analog tuner. The needle moves toward a center notch. Red means far from target, yellow means approaching, and green means Lock. Color is redundant with position, words, cents, and haptics.

### Automatic and manual target selection

With a tuning preset active, the engine chooses the nearest plausible target string automatically. Target hysteresis prevents rapid jumping between strings.

Tapping a string locks the Target note for noisy environments. Tapping it again returns to automatic selection. Chromatic mode has no target-string lock.

### Measurement states

The engine keeps full floating-point pitch and cents values. The main screen rounds cents to a whole number to avoid pretending the microphone offers meaningful decimal-cent precision.

| State | Condition | Product behavior |
|---|---|---|
| Waiting | No credible signal | Ask the player to play a string |
| Unstable | Low clarity, conflicting notes, or excessive noise | Withhold judgment and give a useful correction |
| Far | Stable signal more than 15 cents from target | Show strong direction and a directional roast |
| Near | Stable signal from 3 through 15 cents from target | Show impatient encouragement |
| Lock | Within 3 cents for about 400 ms | Center the meter, turn it green, pulse once, and show a success verdict |
| Dead-on | Within 1 cent while stable | Show a rarer high-precision verdict inside Lock |

Lock is the ordinary successful result. Dead-on is a more exact result, not a completion requirement. `Yeah, that's good enough` is a joke attached to an accurate Lock result.

### Haptics, sound, and screen behavior

- Entering Lock produces one distinct haptic pulse when haptics are enabled.
- Leaving and immediately re-entering Lock does not produce repeated pulses. A short cooldown prevents buzzing around the threshold.
- An optional Lock sound exists but defaults off.
- Reference tones and Lock sounds are perceptually distinct.
- The screen stays awake during an active Tuning session by default.
- The app supports a phone held in one hand, lying flat, or propped against an amplifier.
- The layout remains readable in bright shops and dark rehearsal rooms without a separate visual mode.

## Voice and verdict system

The voice is snarky and can target the instrument, situation, or player. It does not use explicit profanity. The writing should feel authored rather than like a random insult generator.

Verdicts come from state-specific pools:

- Waiting
- Unstable or noisy
- Far and flat
- Far and sharp
- Near
- Lock
- Dead-on
- Prolonged attempt

The app avoids repeating a verdict during the same Tuning session until its applicable pool has been exhausted.

The prolonged-attempt timer only runs while the engine receives a credible signal for the same Target note. It pauses during silence or unrelated noise and resets when the target changes. Stronger lines can appear around 30, 60, and 180 seconds. Example:

> It has been three minutes. Either tune the E string or sell the guitar.

Verdicts never replace the measurement or give unsafe tightening advice.

## Settings

The complete settings surface contains:

- Haptics on or off, default on
- Lock sound on or off, default off
- Keep screen awake on or off, default on
- Privacy information
- About and credits

The app follows system Reduce Motion, VoiceOver, TalkBack, text scaling, and accessibility preferences without exposing additional product settings.

## Visual direction

Detailed visual design happens after the core tuner and configuration flow meet their quality targets.

The settled direction is:

- Canonical name: `cant-tuna`
- Primarily monochrome interface
- Photocopied gig flyers and screen-print misregistration as the main influence
- A battered stompbox influence for the meter and controls
- Colorful stickers as accents
- Red, yellow, and green measurement feedback
- Rough textures and blunt typography
- No blood, explicit profanity, or polished software-as-a-service styling

Texture frames the meter rather than covering it. The detected note, cents, direction, and controls sit on stable high-contrast shapes. Screen-reader labels describe stable summaries such as `A2, 8 cents flat` rather than announcing every audio buffer.

## Privacy and lifecycle

- Audio processing happens in memory on the device.
- The app does not save recordings or detected pitches.
- The app does not transmit audio or usage information.
- The microphone runs only while the app is active and the tuner is listening.
- Moving to the background stops and releases the audio stream.
- Returning to the foreground restarts the stream when permission remains valid.
- Calls, alarms, audio-route changes, unplugged devices, and permission changes must leave the app in a recoverable state.
- Bluetooth input is not a quality promise. The built-in or wired microphone is preferred.
- The privacy policy is available in the app and store listing.

## Technical architecture

### Stack

- Expo with React Native and TypeScript
- A project-specific development build from the start, not Expo Go as the working environment
- `expo-audio` `useAudioStream` for foreground PCM microphone capture
- A pure TypeScript pitch detector first, with Pitchy and its McLeod Pitch Method as the initial candidate
- Local key-value persistence behind a small adapter
- No router, global state library, network client, database, analytics SDK, advertising SDK, or authentication package unless the final code proves one is unavoidable

The researched baseline is Expo SDK 57 and React Native 0.86. Project initialization should use the then-current compatible patch release. Expo AudioStream is young and currently delivers roughly 100 ms native capture chunks, so physical-device measurements decide whether it remains the final capture path.

### Audio pipeline

```text
expo-audio PCM stream
  -> mono int16 samples
  -> reusable normalized Float32 rolling buffer
  -> RMS silence gate
  -> McLeod pitch detection and clarity score
  -> supported-range and harmonic checks
  -> short temporal smoothing
  -> target selection, cents, and tuning state
  -> throttled UI state
```

Starting capture parameters:

- Request 16 kHz mono `int16` PCM.
- Trust the actual sample rate returned by the device.
- Start with a 2,048-sample analysis window and compare 4,096 samples for low-note stability.
- Start with a 25–500 Hz valid target range.
- Start with an RMS silence gate around -50 to -45 dBFS and tune it using device tests.
- Start with a clarity threshold around 0.8 to 0.9 and tune it using device tests.
- Smooth valid detections using the median of the latest three readings.
- Publish calculated tuner state to React, never raw audio buffers.

The pitch engine sits behind a narrow interface so capture or detection can move into a local Swift/Kotlin Expo module without rewriting product logic or UI. If JavaScript detection time is the problem, move only detection native. If Expo's capture cadence feels slow, replace capture and detection together.

### Pitch calculation

For detected frequency `f` and A4 fixed at 440 Hz:

```text
midi = round(69 + 12 * log2(f / 440))
targetHz = 440 * 2^((midi - 69) / 12)
cents = 1200 * log2(f / targetHz)
```

Preset mode compares against plausible strings in the Active tuning and applies harmonic correction and target hysteresis. This is especially important for B0, E1, and F-sharp1, whose fundamentals may be weaker than their harmonics on phone microphones.

## Build order

The work proceeds in this order:

1. Prove PCM capture, pitch detection, latency, low-note stability, and lifecycle handling on physical devices.
2. Implement the deterministic tuning state machine and generated-signal tests.
3. Implement the plain functional tuner screen with automatic selection and manual string lock.
4. Add instrument, string-count, preset, and Chromatic selection with persistence.
5. Add custom tuning editing and Reference tones.
6. Add verdict pools, timing, haptics, Lock sound, and settings.
7. Apply the complete visual system and authored copy.
8. Run accessibility, interruption, offline, performance, and store-readiness checks.

## Quality gates

The core tuner is acceptable only when physical-device testing shows:

- A stable first reading within 300 ms after a clean pluck
- Sustained clean notes reading within 3 cents of calibrated reference signals
- At least 9 of 10 repeated clean plucks per open string without a visible octave jump
- At least 8 visible meter updates per second
- Pitch-detector p95 runtime below 20 ms on the slowest supported test device
- No callback backlog, runaway allocation, or visible UI jank during a 10-minute session
- Reliable recovery after permission denial, backgrounding, calls, alarms, and audio-route changes
- Full operation in airplane mode after installation

Automated DSP fixtures cover every built-in target note using clean sine waves, harmonics with a weak fundamental, decay, detuning, and added noise. Physical tests cover at least:

- Two iPhones
- Two Android phones, including one inexpensive device
- Six-string guitar
- Baritone guitar
- Seven-string guitar
- Eight-string guitar
- Four-string bass
- Five-string low B
- Six-string bass high C
- Quiet-room and ordinary guitar-shop noise

If an uncommon physical instrument cannot be sourced, calibrated recorded fixtures cover it and the limitation is documented before store submission.

## Completion criteria

cant-tuna is complete when:

- Every behavior in this specification works on supported iOS and Android devices.
- All 18 built-in presets and Chromatic mode pass automated pitch fixtures.
- Automatic target selection, manual target lock, custom tuning, persistence, Reference tones, verdict timing, haptics, and settings pass their acceptance tests.
- The tuner meets the physical-device quality gates or the audio engine has been replaced until it does.
- The final punk presentation is legible, responsive, and applied consistently.
- The app contains no network dependency, account flow, ad code, analytics, payment code, or excluded feature.
- Privacy disclosures and store metadata accurately describe the finished binary.

## Research references

- [Expo Audio](https://docs.expo.dev/versions/latest/sdk/audio/)
- [Expo development builds](https://docs.expo.dev/workflow/overview/)
- [Expo custom native code](https://docs.expo.dev/workflow/customizing/)
- [Fender alternate guitar tunings](https://www.fender.com/articles/setup/alternate-guitar-tuning)
- [Fender baritone tuning](https://www.fender.com/articles/setup/tune-like-a-rock-star)
- [Ibanez seven-string specification](https://www.ibanez.com/na/products/detail/aeg721_5b_01.html)
- [Ibanez eight-string specification](https://www.ibanez.com/jp/products/detail/a528_1p_01.html)
- [Yamaha tuner manual with bass tunings](https://usa.yamaha.com/files/download/other_assets/6/320946/G50E.pdf)
- [Apple microphone permission](https://developer.apple.com/documentation/BundleResources/Information-Property-List/NSMicrophoneUsageDescription)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play user-data policy](https://support.google.com/googleplay/android-developer/answer/10144311)
- [Google Play inappropriate-content policy](https://support.google.com/googleplay/android-developer/answer/9878810)
