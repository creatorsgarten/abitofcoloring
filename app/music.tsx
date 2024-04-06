let lastBeat = -1;
interface BeatData {
  time: number;
  note: number;
}
const bpm = 80;
export const beatData = new Map<number, BeatData>();
function getCurrentBeat() {
  return Math.floor(((Date.now() / 1000 / 60) * bpm * 2) % 16);
}

let audioContext: AudioContext | null = null;
let noteBuffer: AudioBuffer | null = null;
let lpf: BiquadFilterNode | null = null;

export function unmute() {
  if (audioContext) return;
  audioContext = new AudioContext();
  lpf = audioContext.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 2000;
  lpf.connect(audioContext.destination);

  const url = new URL("./marimba-notes.ogg", import.meta.url).href;
  fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buffer) => audioContext!.decodeAudioData(buffer))
    .then((audioBuffer) => {
      noteBuffer = audioBuffer;
    });
}

export const noteData = new Map<number, number>();

export function updateBeat() {
  const currentBeat = getCurrentBeat();
  if (currentBeat !== lastBeat) {
    lastBeat = currentBeat;
    const note = noteData.get(currentBeat) ?? 0;
    if (note && noteBuffer && audioContext) {
      beatData.set(currentBeat, {
        time: Date.now(),
        note: note,
      });
      const sampleStart = (note - 1) * 2;
      const sampleLength = 2;
      for (let i = 0; i < 2; i++) {
        const source = audioContext.createBufferSource();
        source.buffer = noteBuffer;
        const gain = audioContext.createGain();
        gain.gain.value = i ? 0.1 : 0.3;
        source.connect(gain);
        gain.connect(lpf!);
        source.start(
          audioContext.currentTime + ((i * 60) / bpm) * 0.75,
          sampleStart,
          sampleLength
        );
      }
    }
  }
  return currentBeat;
}
