// Queued playback of incoming PCM16 audio chunks (Keen's spoken audio) using the
// Web Audio API. Each buffer is scheduled to start right when the previous one
// ends, so chunked network delivery doesn't produce audible gaps or overlaps.
//
// Written but unverified against real audio bytes from a live provider — no
// backend/provider connection is available in this build pass (see report).

export interface AudioPlaybackHandle {
  enqueue: (chunk: Uint8Array) => void;
  stop: () => void;
}

export function createAudioPlayback(sampleRate: number): AudioPlaybackHandle {
  const AudioContextCtor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  const audioContext = new AudioContextCtor();
  let nextStartTime = 0;
  const activeSources: AudioBufferSourceNode[] = [];

  return {
    enqueue: (chunk: Uint8Array) => {
      const byteLength = chunk.byteLength - (chunk.byteLength % 2);
      if (byteLength <= 0) return;
      const pcm16 = new Int16Array(chunk.buffer, chunk.byteOffset, byteLength / 2);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7fff);
      }

      const buffer = audioContext.createBuffer(1, float32.length, sampleRate);
      buffer.copyToChannel(float32, 0);

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);

      const startTime = Math.max(audioContext.currentTime, nextStartTime);
      source.start(startTime);
      nextStartTime = startTime + buffer.duration;

      activeSources.push(source);
      source.onended = () => {
        const idx = activeSources.indexOf(source);
        if (idx !== -1) activeSources.splice(idx, 1);
      };
    },
    stop: () => {
      activeSources.forEach((source) => {
        try {
          source.stop();
        } catch {
          // Already stopped/ended; nothing to do.
        }
      });
      activeSources.length = 0;
      nextStartTime = 0;
    },
  };
}
