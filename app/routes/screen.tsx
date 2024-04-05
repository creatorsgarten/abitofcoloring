import { useEffect, useRef } from "react";
import { colors } from "~/colors";

let lastBeat = -1;

interface BeatData {
  time: number;
  note: number;
}
const beatData = new Map<number, BeatData>();

function getCurrentBeat() {
  return Math.floor(((Date.now() / 1000 / 60) * 100 * 2) % 16);
}

let audioContext: AudioContext | null = null;
let noteBuffer: AudioBuffer | null = null;

function unmute() {
  if (audioContext) return;
  audioContext = new AudioContext();

  const url = new URL("../marimba-notes.ogg", import.meta.url).href;
  fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buffer) => audioContext!.decodeAudioData(buffer))
    .then((audioBuffer) => {
      noteBuffer = audioBuffer;
    });
}

function updateBeat() {
  const currentBeat = getCurrentBeat();
  if (currentBeat !== lastBeat) {
    lastBeat = currentBeat;
    const note = Math.floor(Math.random() * 12) + 1;
    beatData.set(currentBeat, {
      time: Date.now(),
      note: note,
    });
    if (noteBuffer && audioContext) {
      const sampleStart = (note - 1) * 2;
      const sampleLength = 2;
      for (let i = 0; i < 2; i++) {
        const source = audioContext.createBufferSource();
        source.buffer = noteBuffer;
        const gain = audioContext.createGain();
        gain.gain.value = i ? 0.1 : 0.3;
        source.connect(gain);
        gain.connect(audioContext.destination);
        source.start(
          audioContext.currentTime + ((i * 60) / 100) * 0.75,
          sampleStart,
          sampleLength
        );
      }
    }
  }
}

export default function Screen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let ended = false;
    const frame = () => {
      if (ended) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      updateBeat();
      requestAnimationFrame(frame);

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const pillarXW = 118;
      const windowXW = 322;
      const topHeightFrac = 0.2844;
      const total = pillarXW * 4 + windowXW * 3;

      const drawBeat = (beat: number, f: () => void) => {
        const data = beatData.get(beat);
        if (!data) return;
        ctx.save();
        ctx.fillStyle = colors[data.note] || "#FFFFFF";
        ctx.globalAlpha = Math.min(
          1,
          Math.exp(-((Date.now() - data.time) / 2000)) * 2
        );
        f();
        ctx.restore();
      };

      for (let i = 0; i < 4; i++) {
        const x = (((pillarXW + windowXW) * i) / total) * canvas.width;
        const w = (pillarXW / total) * canvas.width;
        drawBeat(i, () => {
          ctx.fillRect(x, 0, w, canvas.height);
        });
      }
      for (let i = 0; i < 3; i++) {
        const x =
          (pillarXW / total + ((pillarXW + windowXW) * i) / total) *
          canvas.width;
        const w = (windowXW / total) * canvas.width;
        drawBeat(i + 4, () => {
          ctx.fillRect(x, 0, w, canvas.height * topHeightFrac);
        });
        drawBeat(i + 7, () => {
          const y = canvas.height * topHeightFrac;
          ctx.fillRect(x, y, w, canvas.height - y);
        });
      }
    };
    requestAnimationFrame(frame);
    return () => {
      ended = true;
    };
  });
  return (
    <div className="fixed inset-0">
      <canvas
        onDoubleClick={unmute}
        ref={canvasRef}
        id="canvas"
        width="1440"
        height="1080"
        className="absolute top-0 left-0 w-full h-full"
      ></canvas>
    </div>
  );
}
