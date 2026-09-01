import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getPresetsForProfile, InstrumentProfile, PRESETS, PROFILES } from './core/tunings';

type Props = {
  visible: boolean;
  profile: InstrumentProfile;
  presetId: string;
  onClose: () => void;
  onSelect: (profileId: string, presetId: string) => void;
};

export function TuningPicker({ visible, profile, presetId, onClose, onSelect }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.scrim}>
        <View style={styles.sheet}>
          <View style={styles.heading}>
            <Text style={styles.title}>Active tuning</Text>
            <Pressable accessibilityRole="button" onPress={onClose}><Text style={styles.done}>Done</Text></Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.label}>Instrument profile</Text>
            <View style={styles.options}>
              {PROFILES.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => onSelect(item.id, getPresetsForProfile(item.id)[0].id)}
                  style={[styles.option, item.id === profile.id && styles.selected]}
                >
                  <Text style={[styles.optionText, item.id === profile.id && styles.selectedText]}>
                    {item.family} · {item.strings}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.label}>Tuning preset</Text>
            <View style={styles.options}>
              {getPresetsForProfile(profile.id).map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => onSelect(profile.id, item.id)}
                  style={[styles.option, item.id === presetId && styles.selected]}
                >
                  <Text style={[styles.optionText, item.id === presetId && styles.selectedText]}>{item.name}</Text>
                </Pressable>
              ))}
              <Pressable
                onPress={() => onSelect(profile.id, 'chromatic')}
                style={[styles.option, presetId === 'chromatic' && styles.selected]}
              >
                <Text style={[styles.optionText, presetId === 'chromatic' && styles.selectedText]}>Chromatic</Text>
              </Pressable>
            </View>
            <Text style={styles.notes}>
              {presetId === 'chromatic' ? 'Nearest chromatic note' : PRESETS.find((item) => item.id === presetId)?.spellings.join('  ')}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#0009' },
  sheet: { maxHeight: '82%', backgroundColor: '#161616', borderTopWidth: 2, borderColor: '#fff' },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#444' },
  title: { color: '#fff', fontSize: 22, fontWeight: '900', textTransform: 'uppercase' },
  done: { color: '#ffe500', fontSize: 17, fontWeight: '800', padding: 8 },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  label: { color: '#aaa', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', marginTop: 8 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { borderWidth: 1, borderColor: '#666', paddingVertical: 10, paddingHorizontal: 12 },
  selected: { backgroundColor: '#fff', borderColor: '#fff' },
  optionText: { color: '#fff', fontWeight: '700' },
  selectedText: { color: '#111' },
  notes: { color: '#aaa', fontSize: 16, marginTop: 4 },
});
