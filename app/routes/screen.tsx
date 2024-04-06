import { useEffect, useRef } from "react";
import { colors } from "~/colors";
import { beatData, unmute, updateBeat } from "../music";

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
