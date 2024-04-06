import { useStore } from "@nanostores/react";
import clsx from "clsx";
import { atom } from "nanostores";
import { useEffect, useRef } from "react";
import { Museum } from "~/Museum";
import instruments from "~/instruments";
import { $scale, $showRef } from "~/showState";
import logo from "../bit-logo.png";
import museumRef from "../ref/ref.jpeg";

export default function Screen2() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      console.log(e.key);
      if (e.key === "s") {
        $scale.set(!$scale.get());
      }
      if (e.key === "r") {
        $showRef.set(!$showRef.get());
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const scale = useStore($scale);
  const showRef = useStore($showRef);

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 w-[1440px] h-[1009px] flex origin-top-left",
        scale ? "scale-x-[1.33334] scale-y-[1.071]" : ""
      )}
    >
      <Museum />
      <div
        className={clsx(
          "mix-blend-multiply absolute inset-0 transition-opacity duration-300 z-50 pointer-events-none",
          showRef ? "opacity-100" : "opacity-0"
        )}
        style={{
          backgroundImage: `url(${museumRef})`,
          backgroundSize: "100% 100%",
        }}
      />
      <div className="absolute top-[32%] h-[20%] left-[10%] w-[19%]">
        {/* Blank left */}

        {/* Color me text */}
        {/* <div className="absolute inset-0 pt-4 transition-opacity duration-200 opacity-100">
          <div className="flex items-center gap-5 justify-center">
            <div style={{ width: "32%" }}>
              <img src={qr} className="max-w-full" />
            </div>
            <div className="text-2xl font-bold tracking-wider">
              SCAN
              <br />
              TO COLOR
            </div>
          </div>
        </div> */}
      </div>
      <div className="absolute top-[32%] h-[12%] right-[40%] left-[40%]">
        {/* Blank center */}

        {/* Text */}
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-contain scale-75"
          style={{
            backgroundImage: `url(${logo})`,
          }}
        ></div>
      </div>
      <div className="absolute top-[32%] h-[20%] right-[10%] w-[19%]">
        {/* Blank right */}

        {/* Icon */}
        <CurrentIcon />
      </div>
    </div>
  );
}

export const $currentIcon = atom({ index: 24 });

setInterval(() => {
  $currentIcon.set({ index: Math.floor(Math.random() * 24) + 1 });
}, 1000);

function CurrentIcon() {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let canceled = false;
    let lastImage: HTMLImageElement | undefined;
    const setImage = (img: HTMLImageElement) => {
      const div = divRef.current;
      if (!div) return;
      if (canceled) return;
      div.appendChild(img);
      clearOldImage();
      lastImage = img;
    };
    const eject = (img: HTMLImageElement) => {
      let x = 0;
      let y = 0;
      let rx = 0;
      let ry = 0;
      let rz = 0;
      const vrx = Math.random() * 2 - 1;
      const vry = Math.random() * 2 - 1;
      const vrz = Math.random() * 2 - 1;

      const theta = (Math.random() * Math.PI) / 2 + Math.PI / 4;
      const vx = Math.cos(theta) * 48;
      let vy = Math.sin(theta) * -24;
      let hp = 100;
      const frame = () => {
        hp--;
        if (hp < 0) {
          img.remove();
          return;
        }
        x += vx;
        y += vy;
        vy += 2;
        rx += vrx * 0.1;
        ry += vry * 0.1;
        rz += vrz * 0.1;
        img.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${rx}rad) rotateY(${ry}rad) rotateZ(${rz}rad)`;
        requestAnimationFrame(frame);
      };
      img.style.zIndex = "999";
      requestAnimationFrame(frame);
    };
    const clearOldImage = () => {
      if (!lastImage) {
        return;
      }
      // lastImage.remove();
      eject(lastImage);
    };
    const unsubscribe = $currentIcon.subscribe((icon) => {
      const img = new Image();
      img.style.filter = "drop-shadow(0 0 10px black)";
      img.className = "absolute top-0 left-0 w-full h-full object-contain";
      img.onload = () => {
        setImage(img);
      };
      img.src = instruments[icon.index - 1];
    });
    return () => {
      unsubscribe();
      clearOldImage();
      canceled = true;
    };
  }, []);
  return <div ref={divRef} />;
}
