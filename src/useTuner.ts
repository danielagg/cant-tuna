import { useAudioStream } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  classifyFrequency,
  detectPitch,
  int16ToMono,
  Measurement,
  midiLabel,
  stateFor,
} from './core/tuner';

const WINDOW_SIZE = 4096;
const PUBLISH_INTERVAL_MS = 80;

export const useTuner = (targets: number[] | null, lockedTarget: number | null) => {
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bufferRef = useRef(new Float32Array(WINDOW_SIZE));
  const bufferedRef = useRef(0);
  const targetsRef = useRef(targets);
  const lockedRef = useRef(lockedTarget);
  const previousTargetRef = useRef<number | null>(null);
  const stableTargetRef = useRef<number | null>(null);
  const stableSinceRef = useRef(0);
  const lastPublishRef = useRef(0);
  const lockedStateRef = useRef(false);
  const lastHapticRef = useRef(Number.NEGATIVE_INFINITY);
  const frequencyHistoryRef = useRef<number[]>([]);

  useEffect(() => { targetsRef.current = targets; }, [targets]);
  useEffect(() => { lockedRef.current = lockedTarget; }, [lockedTarget]);

  const onBuffer = useCallback((chunk: { data: ArrayBuffer; channels: number; sampleRate: number; timestamp: number }) => {
    const incoming = int16ToMono(chunk.data, chunk.channels);
    const buffer = bufferRef.current;
    if (incoming.length >= WINDOW_SIZE) {
      buffer.set(incoming.subarray(incoming.length - WINDOW_SIZE));
      bufferedRef.current = WINDOW_SIZE;
    } else {
      buffer.copyWithin(0, incoming.length);
      buffer.set(incoming, WINDOW_SIZE - incoming.length);
      bufferedRef.current = Math.min(WINDOW_SIZE, bufferedRef.current + incoming.length);
    }

    if (bufferedRef.current < 2048) return;
    const now = chunk.timestamp * 1000;
    if (now - lastPublishRef.current < PUBLISH_INTERVAL_MS) return;

    const source = bufferedRef.current < WINDOW_SIZE ? buffer.subarray(WINDOW_SIZE - bufferedRef.current) : buffer;
    const pitch = detectPitch(source, chunk.sampleRate);
    lastPublishRef.current = now;
    if (!pitch) {
      stableTargetRef.current = null;
      lockedStateRef.current = false;
      frequencyHistoryRef.current = [];
      setMeasurement(null);
      return;
    }

    frequencyHistoryRef.current = [...frequencyHistoryRef.current.slice(-2), pitch.frequency];
    const sortedFrequencies = [...frequencyHistoryRef.current].sort((a, b) => a - b);
    const frequency = sortedFrequencies[Math.floor(sortedFrequencies.length / 2)];

    const classified = classifyFrequency(
      frequency,
      targetsRef.current,
      lockedRef.current,
      previousTargetRef.current,
    );
    previousTargetRef.current = classified.targetMidi;

    if (stableTargetRef.current !== classified.targetMidi || Math.abs(classified.cents) > 3) {
      stableTargetRef.current = classified.targetMidi;
      stableSinceRef.current = now;
    }
    const state = stateFor(classified.cents, pitch.clarity, now - stableSinceRef.current);
    const isLocked = state === 'lock' || state === 'dead-on';
    if (isLocked && !lockedStateRef.current && now - lastHapticRef.current >= 1500) {
      lastHapticRef.current = now;
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    lockedStateRef.current = isLocked;

    setMeasurement({
      detectedMidi: Math.round(classified.targetMidi + classified.cents / 100),
      detectedLabel: midiLabel(classified.targetMidi + classified.cents / 100),
      targetMidi: classified.targetMidi,
      cents: classified.cents,
      clarity: pitch.clarity,
      state,
    });
  }, []);

  const { stream, isStreaming } = useAudioStream({
    sampleRate: 16_000,
    channels: 1,
    encoding: 'int16',
    onBuffer,
  });

  const start = useCallback(async () => {
    try {
      setError(null);
      await stream.start();
    } catch {
      setError('The microphone stream failed to start. Try again.');
    }
  }, [stream]);

  const stop = useCallback(async () => {
    try {
      await stream.stop();
    } finally {
      setMeasurement(null);
      bufferedRef.current = 0;
      previousTargetRef.current = null;
      stableTargetRef.current = null;
      stableSinceRef.current = 0;
      lastPublishRef.current = 0;
      lockedStateRef.current = false;
      frequencyHistoryRef.current = [];
    }
  }, [stream]);

  return { measurement, error, isStreaming, start, stop };
};
