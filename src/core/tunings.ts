export type InstrumentFamily = 'Guitar' | 'Baritone Guitar' | 'Bass';

export type InstrumentProfile = {
  id: string;
  family: InstrumentFamily;
  strings: number;
};

export type TuningPreset = {
  id: string;
  profileId: string;
  name: string;
  targets: number[];
  spellings: string[];
};

export const PROFILES: InstrumentProfile[] = [
  { id: 'guitar-6', family: 'Guitar', strings: 6 },
  { id: 'guitar-7', family: 'Guitar', strings: 7 },
  { id: 'guitar-8', family: 'Guitar', strings: 8 },
  { id: 'baritone-6', family: 'Baritone Guitar', strings: 6 },
  { id: 'bass-4', family: 'Bass', strings: 4 },
  { id: 'bass-5', family: 'Bass', strings: 5 },
  { id: 'bass-6', family: 'Bass', strings: 6 },
];

const preset = (
  id: string,
  profileId: string,
  name: string,
  targets: number[],
  spellings: string[],
): TuningPreset => ({ id, profileId, name, targets, spellings });

export const PRESETS: TuningPreset[] = [
  preset('g6-standard', 'guitar-6', 'Standard', [40, 45, 50, 55, 59, 64], ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']),
  preset('g6-eb', 'guitar-6', 'E♭ Standard', [39, 44, 49, 54, 58, 63], ['E♭2', 'A♭2', 'D♭3', 'G♭3', 'B♭3', 'E♭4']),
  preset('g6-d', 'guitar-6', 'D Standard', [38, 43, 48, 53, 57, 62], ['D2', 'G2', 'C3', 'F3', 'A3', 'D4']),
  preset('g6-drop-d', 'guitar-6', 'Drop D', [38, 45, 50, 55, 59, 64], ['D2', 'A2', 'D3', 'G3', 'B3', 'E4']),
  preset('g6-drop-cs', 'guitar-6', 'Drop C♯', [37, 44, 49, 54, 58, 63], ['C♯2', 'G♯2', 'C♯3', 'F♯3', 'A♯3', 'D♯4']),
  preset('g6-drop-c', 'guitar-6', 'Drop C', [36, 43, 48, 53, 57, 62], ['C2', 'G2', 'C3', 'F3', 'A3', 'D4']),
  preset('g6-dadgad', 'guitar-6', 'DADGAD', [38, 45, 50, 55, 57, 62], ['D2', 'A2', 'D3', 'G3', 'A3', 'D4']),
  preset('baritone-b', 'baritone-6', 'B Standard', [35, 40, 45, 50, 54, 59], ['B1', 'E2', 'A2', 'D3', 'F♯3', 'B3']),
  preset('baritone-a', 'baritone-6', 'A Standard', [33, 38, 43, 48, 52, 57], ['A1', 'D2', 'G2', 'C3', 'E3', 'A3']),
  preset('baritone-drop-a', 'baritone-6', 'Drop A', [33, 40, 45, 50, 54, 59], ['A1', 'E2', 'A2', 'D3', 'F♯3', 'B3']),
  preset('g7-b', 'guitar-7', 'B Standard', [35, 40, 45, 50, 55, 59, 64], ['B1', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4']),
  preset('g7-drop-a', 'guitar-7', 'Drop A', [33, 40, 45, 50, 55, 59, 64], ['A1', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4']),
  preset('g8-fs', 'guitar-8', 'F♯ Standard', [30, 35, 40, 45, 50, 55, 59, 64], ['F♯1', 'B1', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4']),
  preset('g8-drop-e', 'guitar-8', 'Drop E', [28, 35, 40, 45, 50, 55, 59, 64], ['E1', 'B1', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4']),
  preset('bass4-standard', 'bass-4', 'Standard', [28, 33, 38, 43], ['E1', 'A1', 'D2', 'G2']),
  preset('bass4-drop-d', 'bass-4', 'Drop D', [26, 33, 38, 43], ['D1', 'A1', 'D2', 'G2']),
  preset('bass5-standard', 'bass-5', 'Low-B Standard', [23, 28, 33, 38, 43], ['B0', 'E1', 'A1', 'D2', 'G2']),
  preset('bass6-standard', 'bass-6', 'Standard', [23, 28, 33, 38, 43, 48], ['B0', 'E1', 'A1', 'D2', 'G2', 'C3']),
];

export const DEFAULT_PRESET_ID = 'g6-standard';

export const getProfile = (id: string) => PROFILES.find((item) => item.id === id) ?? PROFILES[0];
export const getPreset = (id: string) => PRESETS.find((item) => item.id === id) ?? PRESETS[0];
export const getPresetsForProfile = (profileId: string) => PRESETS.filter((item) => item.profileId === profileId);

export const activeTuningLabel = (profile: InstrumentProfile, presetId: string) => {
  const tuning = presetId === 'chromatic' ? 'Chromatic' : getPreset(presetId).name;
  return `${profile.family} · ${profile.strings} strings · ${tuning}`;
};
