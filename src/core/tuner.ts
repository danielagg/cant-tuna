export type PitchReading = {
  frequency: number;
  clarity: number;
  rms: number;
};

export type TuningState = 'waiting' | 'unstable' | 'far' | 'near' | 'lock' | 'dead-on';

export type Measurement = {
  detectedMidi: number;
  detectedLabel: string;
  targetMidi: number;
  cents: number;
  clarity: number;
  state: TuningState;
};

const NOTE_NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];

export const midiToFrequency = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
export const frequencyToMidi = (frequency: number) => 69 + 12 * Math.log2(frequency / 440);
export const centsBetween = (frequency: number, midi: number) => 1200 * Math.log2(frequency / midiToFrequency(midi));

export const midiLabel = (midi: number) => {
  const rounded = Math.round(midi);
  return `${NOTE_NAMES[(rounded % 12 + 12) % 12]}${Math.floor(rounded / 12) - 1}`;
};

export const detectPitch = (samples: Float32Array, sampleRate: number): PitchReading | null => {
  if (samples.length < 512 || sampleRate <= 0) return null;

  let mean = 0;
  for (const sample of samples) mean += sample;
  mean /= samples.length;

  let sumSquares = 0;
  for (const sample of samples) {
    const centered = sample - mean;
    sumSquares += centered * centered;
  }
  const rms = Math.sqrt(sumSquares / samples.length);
  if (rms < 0.005) return null;

  const minLag = Math.max(2, Math.floor(sampleRate / 500));
  const maxLag = Math.min(Math.floor(sampleRate / 25), Math.floor(samples.length / 2));
  const scores = new Float32Array(maxLag + 1);
  let bestScore = -1;

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let correlation = 0;
    let energy = 0;
    for (let i = 0; i < samples.length - lag; i += 1) {
      const a = samples[i] - mean;
      const b = samples[i + lag] - mean;
      correlation += a * b;
      energy += a * a + b * b;
    }
    const score = energy ? (2 * correlation) / energy : 0;
    scores[lag] = score;
    if (score > bestScore) bestScore = score;
  }

  if (bestScore < 0.75) return null;

  const threshold = bestScore * 0.92;
  let peak = minLag;
  for (let lag = minLag + 1; lag < maxLag; lag += 1) {
    if (scores[lag] >= threshold && scores[lag] > scores[lag - 1] && scores[lag] >= scores[lag + 1]) {
      peak = lag;
      break;
    }
  }

  const left = scores[peak - 1] ?? scores[peak];
  const center = scores[peak];
  const right = scores[peak + 1] ?? scores[peak];
  const divisor = 2 * (2 * center - left - right);
  const refinedLag = divisor ? peak + (right - left) / divisor : peak;

  return { frequency: sampleRate / refinedLag, clarity: center, rms };
};

const nearestTarget = (frequency: number, targets: number[]) => targets.reduce(
  (best, target) => Math.abs(centsBetween(frequency, target)) < Math.abs(centsBetween(frequency, best)) ? target : best,
  targets[0],
);

export const classifyFrequency = (
  frequency: number,
  targets: number[] | null,
  lockedTarget: number | null = null,
  previousTarget: number | null = null,
) => {
  if (!targets?.length) {
    const targetMidi = Math.round(frequencyToMidi(frequency));
    return { frequency, targetMidi, cents: centsBetween(frequency, targetMidi) };
  }

  if (lockedTarget !== null) {
    return [frequency, frequency / 2, frequency / 3, frequency / 4]
      .map((candidate) => ({ frequency: candidate, targetMidi: lockedTarget, cents: centsBetween(candidate, lockedTarget) }))
      .reduce((best, candidate) => Math.abs(candidate.cents) < Math.abs(best.cents) ? candidate : best);
  }

  const candidates = [frequency, frequency / 2, frequency / 3, frequency / 4]
    .map((candidate) => ({
      frequency: candidate,
      targetMidi: nearestTarget(candidate, targets),
    }))
    .map((candidate) => ({ ...candidate, cents: centsBetween(candidate.frequency, candidate.targetMidi) }))
    .filter((candidate) => Math.abs(candidate.cents) <= 100);

  let best = candidates.reduce((current, candidate) => (
    Math.abs(candidate.cents) < Math.abs(current.cents) ? candidate : current
  ), candidates[0] ?? {
    frequency,
    targetMidi: nearestTarget(frequency, targets),
    cents: centsBetween(frequency, nearestTarget(frequency, targets)),
  });

  if (previousTarget !== null) {
    const previous = candidates.find((candidate) => candidate.targetMidi === previousTarget);
    if (previous && Math.abs(previous.cents) <= Math.abs(best.cents) + 12) best = previous;
  }

  return best;
};

export const stateFor = (cents: number, clarity: number, stableForMs: number): TuningState => {
  if (clarity < 0.82) return 'unstable';
  const distance = Math.abs(cents);
  if (distance > 15) return 'far';
  if (distance > 3) return 'near';
  if (stableForMs < 400) return 'near';
  return distance <= 1 ? 'dead-on' : 'lock';
};

export const int16ToMono = (data: ArrayBuffer, channels: number) => {
  const input = new Int16Array(data);
  const output = new Float32Array(Math.floor(input.length / channels));
  for (let frame = 0; frame < output.length; frame += 1) {
    let total = 0;
    for (let channel = 0; channel < channels; channel += 1) total += input[frame * channels + channel];
    output[frame] = total / channels / 32768;
  }
  return output;
};
