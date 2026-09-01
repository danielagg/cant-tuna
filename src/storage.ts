import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_PRESET_ID, getPreset } from './core/tunings';

const ACTIVE_TUNING_KEY = 'cant-tuna.active-tuning.v1';

export type SavedTuning = { profileId: string; presetId: string };

export const loadActiveTuning = async (): Promise<SavedTuning> => {
  try {
    const saved = JSON.parse(await AsyncStorage.getItem(ACTIVE_TUNING_KEY) ?? 'null') as SavedTuning | null;
    if (saved?.presetId === 'chromatic') return saved;
    if (saved) {
      const preset = getPreset(saved.presetId);
      if (preset.profileId === saved.profileId) return saved;
    }
  } catch {}
  return { profileId: 'guitar-6', presetId: DEFAULT_PRESET_ID };
};

export const saveActiveTuning = (value: SavedTuning) =>
  AsyncStorage.setItem(ACTIVE_TUNING_KEY, JSON.stringify(value));
