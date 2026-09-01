# cant-tuna

cant-tuna is a guitar and bass tuner for players who want a fast, precise tool with a rough punk identity. The identity adds character but never obscures or weakens the tuner.

## Language

**Instrument profile**:
An instrument family and string count used to filter applicable tuning presets, such as eight-string Guitar or five-string Bass.
_Avoid_: Instrument, configuration, string setup

**Tuning session**:
The period from microphone activation until the player leaves or pauses the tuner. A session works without an internet connection, account, advertisement, or other interruption.
_Avoid_: Practice session, recording session

**Tuning preset**:
A named set of target notes associated with an instrument and string count, such as six-string Guitar Standard or four-string Bass Drop D.
_Avoid_: Tuning mode, instrument profile

**Active tuning**:
The combination of instrument, string count, and tuning preset currently guiding the session. Six-string Guitar Standard is active on first use; subsequent sessions resume the player's most recent choice.
_Avoid_: Default tuning, current mode

**Custom tuning**:
A tuning preset the player creates by copying an existing preset and changing its target notes. Custom tunings stay on the device.
_Avoid_: Custom preset, user tuning

**Reference tone**:
A short, player-triggered sound that demonstrates one target note while editing a custom tuning. It is an audition aid, not part of live pitch detection.
_Avoid_: Confirmation sound, pitch pipe

**Detected note**:
The note inferred from the live instrument signal, including its octave and distance from the nearest target in cents.
_Avoid_: Heard note, input note

**Target note**:
The pitch a string should reach under the active tuning preset or manual string selection.
_Avoid_: Correct note, desired pitch

**Tuning verdict**:
A short, state-aware comment shown alongside the measurement. A verdict may roast the instrument, situation, or player, but never changes the accuracy threshold or replaces the note, cents, and flat-or-sharp guidance.
_Avoid_: Insult, accuracy result, good-enough threshold

**Lock**:
A stable detected note within three cents of its target for roughly 400 milliseconds. Lock is the ordinary success state regardless of which tuning verdict accompanies it.
_Avoid_: Good enough, perfect

**Dead-on**:
A stable detected note within one cent of its target. It is a more exact result inside Lock, not a requirement for completing a string.
_Avoid_: Perfect, exact

**Punk presentation**:
The monochrome rough textures, typography, colorful stickers, motion, and snarky writing that give cant-tuna its identity. It frames the measurement and controls without reducing legibility or precision; the readout uses red, yellow, and green as the detected note approaches its target.
_Avoid_: Grunge mode, novelty theme
