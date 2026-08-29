// Browser-side microphone capture: requests mic permission, downsamples to 16kHz
// mono, and streams fixed-size PCM16 chunks to a callback. Used by the voice
// provider connectors (see providers/) to feed VoiceSession audio input.
//
// Uses ScriptProcessorNode rather than an AudioWorklet: it is deprecated but still
// supported in every current browser and needs no separate worklet module file to
// ship, keeping this a single self-contained file. Revisit only if a real problem
// shows up (AudioWorklet has no timeline pressure to justify it yet).
//
// Written but unverified against a live microphone in this build pass — no browser
// automation tool was available to exercise getUserMedia interactively. The
// downsample/PCM16 math is standard and was reasoned through carefully, but it has
// not been run against real audio hardware.

export interface AudioCaptureHandle {
  stop: () => void;
}

const TARGET_SAMPLE_RATE = 16000;

export async function startAudioCapture(
  onChunk: (chunk: Int16Array) => void,
  onError: (message: string) => void
): Promise<AudioCaptureHandle> {
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    const message =
      err instanceof DOMException && err.name === "NotAllowedError"
        ? "Microphone permission was denied."
        : "Could not access the microphone.";
    onError(message);
    throw err;
  }

  const AudioContextCtor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  const audioContext = new AudioContextCtor();
  const source = audioContext.createMediaStreamSource(stream);
  const processor = audioContext.createScriptProcessor(4096, 1, 1);
  const inputSampleRate = audioContext.sampleRate;

  // A zero-gain node between the processor and destination: ScriptProcessorNode only
  // fires onaudioprocess while connected into the graph toward destination, but we
  // never want the visitor to hear their own mic played back (echo/feedback), so the
  // signal is routed through a silent gain node instead of straight to speakers.
  const silentGain = audioContext.createGain();
  silentGain.gain.value = 0;

  processor.onaudioprocess = (event) => {
    const input = event.inputBuffer.getChannelData(0);
    const downsampled = downsampleTo16kHz(input, inputSampleRate);
    onChunk(floatToPCM16(downsampled));
  };

  source.connect(processor);
  processor.connect(silentGain);
  silentGain.connect(audioContext.destination);

  return {
    stop: () => {
      try {
        processor.disconnect();
        source.disconnect();
        silentGain.disconnect();
        stream.getTracks().forEach((track) => track.stop());
        void audioContext.close();
      } catch {
        // Best-effort teardown; nothing left to surface to the user once we're
        // already stopping the session.
      }
    },
  };
}

function downsampleTo16kHz(input: Float32Array, inputSampleRate: number): Float32Array {
  if (inputSampleRate === TARGET_SAMPLE_RATE) return input;
  const ratio = inputSampleRate / TARGET_SAMPLE_RATE;
  const outputLength = Math.floor(input.length / ratio);
  const output = new Float32Array(outputLength);
  for (let i = 0; i < outputLength; i++) {
    output[i] = input[Math.floor(i * ratio)];
  }
  return output;
}

function floatToPCM16(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output;
}
