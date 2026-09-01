import {
  AppState,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  setIsAudioActiveAsync,
} from 'expo-audio';
import { useKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';

import { TuningPicker } from './src/TuningPicker';
import {
  activeTuningLabel,
  getPreset,
  getProfile,
} from './src/core/tunings';
import { midiLabel, TuningState } from './src/core/tuner';
import { loadActiveTuning, saveActiveTuning } from './src/storage';
import { useTuner } from './src/useTuner';

type Permission = 'loading' | 'undetermined' | 'granted' | 'denied';

const verdicts: Record<TuningState | 'waiting', string> = {
  waiting: 'Play a string. Any day now.',
  unstable: 'One string at a time, hero.',
  far: 'That string needs actual work.',
  near: 'Close. Do not get sentimental.',
  lock: "Yeah, that's good enough.",
  'dead-on': 'Dead on. Suspiciously competent.',
};

const colorFor = (state: TuningState | 'waiting') => {
  if (state === 'lock' || state === 'dead-on') return '#36d66b';
  if (state === 'near') return '#ffe500';
  if (state === 'waiting' || state === 'unstable') return '#aaa';
  return '#ff4b45';
};

export default function App() {
  useKeepAwake();
  const [permission, setPermission] = useState<Permission>('loading');
  const [profileId, setProfileId] = useState('guitar-6');
  const [presetId, setPresetId] = useState('g6-standard');
  const [lockedTarget, setLockedTarget] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const profile = getProfile(profileId);
  const preset = getPreset(presetId);
  const targets = presetId === 'chromatic' ? null : preset.targets;
  const { measurement, error, isStreaming, start, stop } = useTuner(targets, lockedTarget);

  useEffect(() => {
    void Promise.all([loadActiveTuning(), getRecordingPermissionsAsync()]).then(async ([saved, mic]) => {
      setProfileId(saved.profileId);
      setPresetId(saved.presetId);
      setPermission(mic.granted ? 'granted' : mic.status === 'undetermined' ? 'undetermined' : 'denied');
      if (mic.granted) {
        await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true, interruptionMode: 'doNotMix' });
        await start();
      }
    });
  }, [start]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void setIsAudioActiveAsync(true).then(async () => {
          const mic = await getRecordingPermissionsAsync();
          if (!mic.granted) return;
          setPermission('granted');
          await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true, interruptionMode: 'doNotMix' });
          await start();
        });
      } else {
        void stop().then(() => setIsAudioActiveAsync(false));
      }
    });
    return () => subscription.remove();
  }, [start, stop]);

  const requestMic = async () => {
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true, interruptionMode: 'doNotMix' });
    const result = await requestRecordingPermissionsAsync();
    setPermission(result.granted ? 'granted' : 'denied');
    if (result.granted) await start();
  };

  const selectTuning = (nextProfileId: string, nextPresetId: string) => {
    setProfileId(nextProfileId);
    setPresetId(nextPresetId);
    setLockedTarget(null);
    void saveActiveTuning({ profileId: nextProfileId, presetId: nextPresetId });
  };

  const selectedString = useMemo(() => {
    if (!measurement || presetId === 'chromatic') return -1;
    return preset.targets.indexOf(measurement.targetMidi);
  }, [measurement, preset, presetId]);

  const state = measurement?.state ?? 'waiting';
  const color = colorFor(state);
  const cents = measurement ? Math.round(measurement.cents) : 0;
  const needlePosition = 50 + Math.max(-50, Math.min(50, cents)) * 0.9;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.screen}>
        <Text style={styles.brand}>cant-tuna</Text>

        <Pressable style={styles.tuningButton} onPress={() => setPickerOpen(true)} accessibilityRole="button">
          <Text style={styles.tuningText}>{activeTuningLabel(profile, presetId)}</Text>
          <Text style={styles.chevron}>▼</Text>
        </Pressable>

        {permission !== 'granted' ? (
          <View style={styles.permission}>
            <Text style={styles.permissionTitle}>The tuner needs your mic.</Text>
            <Text style={styles.permissionBody}>
              Audio is analyzed on this phone, never saved, and never sent anywhere.
            </Text>
            {permission === 'denied' ? (
              <Pressable style={styles.primaryButton} onPress={() => Linking.openSettings()}>
                <Text style={styles.primaryText}>Open system settings</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.primaryButton} onPress={requestMic} disabled={permission === 'loading'}>
                <Text style={styles.primaryText}>{permission === 'loading' ? 'Checking mic…' : 'Turn on the mic'}</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <>
            <View style={styles.readout} accessibilityLabel={measurement ? `${measurement.detectedLabel}, ${Math.abs(cents)} cents ${cents < 0 ? 'flat' : 'sharp'}` : 'Waiting for a string'}>
              <Text style={styles.kicker}>Detected note</Text>
              <Text style={[styles.note, { color }]}>{measurement?.detectedLabel ?? '—'}</Text>
              <Text style={styles.target}>
                {measurement ? `Target ${midiLabel(measurement.targetMidi)}` : isStreaming ? 'Listening' : 'Mic paused'}
              </Text>
              <Text style={[styles.cents, { color }]}>{measurement ? `${cents > 0 ? '+' : ''}${cents}¢` : '···'}</Text>
              <Text style={[styles.direction, { color }]}>
                {!measurement || Math.abs(cents) <= 1 ? 'CENTER' : cents < 0 ? '← FLAT' : 'SHARP →'}
              </Text>
            </View>

            <View style={styles.meter}>
              <View style={styles.meterLine} />
              <View style={styles.centerNotch} />
              <View style={[styles.needle, { left: `${needlePosition}%`, backgroundColor: color }]} />
            </View>

            <Text style={[styles.verdict, { color }]}>{error ?? verdicts[state]}</Text>

            {presetId !== 'chromatic' && (
              <View style={styles.strings}>
                {preset.targets.map((target, index) => {
                  const active = lockedTarget === target || (lockedTarget === null && index === selectedString);
                  return (
                    <Pressable
                      key={`${target}-${index}`}
                      onPress={() => setLockedTarget(lockedTarget === target ? null : target)}
                      accessibilityRole="button"
                      accessibilityLabel={`${preset.spellings[index]} string, ${lockedTarget === target ? 'locked, tap for automatic selection' : 'tap to lock target'}`}
                      style={[styles.string, active && { borderColor: color, backgroundColor: '#252525' }]}
                    >
                      <Text style={[styles.stringText, active && { color }]}>{preset.spellings[index]}</Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
            <Text style={styles.auto}>{lockedTarget === null ? 'AUTO TARGET' : `LOCKED TO ${midiLabel(lockedTarget)} · TAP AGAIN FOR AUTO`}</Text>
          </>
        )}
      </View>

      <TuningPicker
        visible={pickerOpen}
        profile={profile}
        presetId={presetId}
        onClose={() => setPickerOpen(false)}
        onSelect={selectTuning}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0c0c0c' },
  screen: { flex: 1, paddingHorizontal: 20, paddingVertical: 12, alignItems: 'stretch' },
  brand: { color: '#fff', fontSize: 23, fontWeight: '900', letterSpacing: -1, marginBottom: 14 },
  tuningButton: { minHeight: 48, borderWidth: 1, borderColor: '#777', paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tuningText: { color: '#fff', flex: 1, fontWeight: '800' },
  chevron: { color: '#ffe500', marginLeft: 10 },
  permission: { flex: 1, justifyContent: 'center', gap: 18 },
  permissionTitle: { color: '#fff', fontSize: 36, fontWeight: '900', textTransform: 'uppercase' },
  permissionBody: { color: '#bbb', fontSize: 18, lineHeight: 26 },
  primaryButton: { backgroundColor: '#ffe500', padding: 16, alignItems: 'center' },
  primaryText: { color: '#111', fontWeight: '900', textTransform: 'uppercase', fontSize: 16 },
  readout: { alignItems: 'center', paddingTop: 30 },
  kicker: { color: '#888', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },
  note: { fontSize: 104, lineHeight: 116, fontWeight: '900', letterSpacing: -7 },
  target: { color: '#ddd', fontSize: 18, fontWeight: '700' },
  cents: { fontSize: 38, fontWeight: '900', marginTop: 8 },
  direction: { fontSize: 15, fontWeight: '900', letterSpacing: 2 },
  meter: { height: 56, marginTop: 22, justifyContent: 'center' },
  meterLine: { height: 4, backgroundColor: '#444' },
  centerNotch: { position: 'absolute', left: '50%', width: 3, height: 32, backgroundColor: '#fff' },
  needle: { position: 'absolute', width: 5, height: 52, marginLeft: -2 },
  verdict: { minHeight: 54, textAlign: 'center', fontSize: 20, lineHeight: 26, fontWeight: '900', textTransform: 'uppercase', marginTop: 18 },
  strings: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 'auto' },
  string: { minWidth: 48, minHeight: 48, borderWidth: 2, borderColor: '#555', alignItems: 'center', justifyContent: 'center' },
  stringText: { color: '#ddd', fontSize: 16, fontWeight: '900' },
  auto: { color: '#777', fontSize: 11, fontWeight: '800', textAlign: 'center', marginTop: 12, minHeight: 16 },
});
