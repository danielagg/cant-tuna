import assert from 'node:assert/strict';
import test from 'node:test';

import { PRESETS } from './tunings.ts';
import { centsBetween, classifyFrequency, detectPitch, midiToFrequency, stateFor } from './tuner.ts';

const sine = (frequency: number, sampleRate = 16_000, length = 4096) => {
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i += 1) samples[i] = 0.7 * Math.sin(2 * Math.PI * frequency * i / sampleRate);
  return samples;
};

test('contains every specified built-in preset', () => {
  assert.equal(PRESETS.length, 18);
});

test('pitch math is centered on A4 at 440 Hz', () => {
  assert.equal(midiToFrequency(69), 440);
  assert.ok(Math.abs(centsBetween(440, 69)) < 0.0001);
});

test('detects a clean guitar A within one cent', () => {
  const reading = detectPitch(sine(110), 16_000);
  if (!reading) assert.fail('expected a pitch reading');
  assert.ok(Math.abs(centsBetween(reading.frequency, 45)) < 1);
});

test('detects every built-in target from a clean signal', () => {
  const targets = [...new Set(PRESETS.flatMap((item) => item.targets))];
  for (const target of targets) {
    const reading = detectPitch(sine(midiToFrequency(target)), 16_000);
    if (!reading) assert.fail(`no reading for MIDI ${target}`);
    assert.ok(Math.abs(centsBetween(reading.frequency, target)) < 3, `MIDI ${target} missed`);
  }
});

test('rejects silence', () => {
  assert.equal(detectPitch(new Float32Array(4096), 16_000), null);
});

test('corrects a clear octave harmonic toward a preset target', () => {
  const result = classifyFrequency(164.8138, [40, 45, 50, 55, 59, 64]);
  assert.equal(result.targetMidi, 40);
  assert.ok(Math.abs(result.cents) < 0.01);
});

test('corrects a clear octave harmonic for a locked target', () => {
  const result = classifyFrequency(164.8138, [40, 45, 50, 55, 59, 64], 40);
  assert.equal(result.targetMidi, 40);
  assert.ok(Math.abs(result.cents) < 0.01);
});

test('requires a stable 400 ms before lock', () => {
  assert.equal(stateFor(2, 0.95, 399), 'near');
  assert.equal(stateFor(2, 0.95, 400), 'lock');
  assert.equal(stateFor(0.5, 0.95, 400), 'dead-on');
});
