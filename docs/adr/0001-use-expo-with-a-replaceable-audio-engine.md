# Use Expo with a replaceable audio engine

Use Expo, React Native, TypeScript, and `expo-audio` for the cross-platform app because current Expo releases expose live PCM microphone buffers and keep one shared product implementation. Real-time tuner latency and low-frequency accuracy remain device-sensitive, so capture and pitch detection sit behind a small interface that can be replaced by a local native Expo module without rewriting the tuner state or UI.
