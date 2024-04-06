import { useStore } from "@nanostores/react";
import clsx from "clsx";
import { onValue, ref } from "firebase/database";
import { atom } from "nanostores";
import { useEffect, useRef } from "react";
import { Museum, MuseumContext } from "~/Museum";
import { database } from "~/firebase.client";
import instruments from "~/instruments";
import { noteData, unmute, updateBeat } from "~/music";
import { getFirebaseDatabaseQueryStore } from "~/nanofire";
import { $scale, $showRef } from "~/showState";
import { ConfigSwitch } from "../ConfigSwitch";
import logo from "../bit-logo.png";
import qr from "../colorme.png";
import garten from "../garten.svg";
import museumRef from "../ref/ref.jpeg";

const $beat = atom(-1);
const $playMusic = atom(false);

const Config: MuseumContext = {
  renderSegmentChildren: (index, note) => {
    return <SegmentMusicVisualizer index={index} note={note} />;
  },
};

export interface SegmentMusicVisualizer {
  index: number;
  note: number | null;
}
const noteName = "ซฺ ลฺ ด ร ม ซ ล ดํ รํ มํ ซํ ลํ".split(" ");
export function SegmentMusicVisualizer(props: SegmentMusicVisualizer) {
  const beat = useStore($beat);
  const playing = useStore($playMusic);
  const divRef = useRef<HTMLDivElement>(null);
  const note = props.note;
  useEffect(() => {
    if (note) noteData.set(props.index - 1, note + 1);
  }, [note, props.index]);
  useEffect(() => {
    if (!playing) return;
    if (beat + 1 === props.index) {
      const div = divRef.current;
      if (div) {
        div.style.opacity = "0.5";
        requestAnimationFrame(() => {
          div.style.transition = "opacity 0.5s";
          div.style.opacity = "0";
          setTimeout(() => {
            div.style.transition = "";
          }, 1000);
        });
      }
    }
  }, [beat, props.index, playing]);
  if (!playing) return null;
  return (
    <div
      className="absolute inset-0 bg-white/50 opacity-0 flex items-center justify-center text-8xl text-black"
      ref={divRef}
    >
      {noteName[note]}
    </div>
  );
}

export default function Screen2() {
  useEffect(() => {
    let ended = false;
    const frame = () => {
      if (ended) return;
      $beat.set(updateBeat());
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => {
      ended = true;
    };
  });

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
      onDoubleClick={() => {
        $playMusic.set(true);
        unmute();
      }}
    >
      <MuseumContext.Provider value={Config}>
        <Museum />
      </MuseumContext.Provider>
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
      <div className="absolute top-[34%] h-[20%] left-[10%] w-[19%]">
        <ConfigSwitch configKey="leftMode" value="garten">
          <GartenLogo />
        </ConfigSwitch>

        <ConfigSwitch configKey="leftMode" value="qr">
          <div className="absolute inset-0 transition-opacity duration-200 opacity-100">
            <div className="flex items-center gap-5 justify-center">
              <div style={{ width: "32%" }}>
                <img src={qr} className="max-w-full" alt="" />
              </div>
              <div className="text-2xl font-bold tracking-wider">
                SCAN
                <br />
                TO COLOR
              </div>
            </div>
          </div>
        </ConfigSwitch>
      </div>
      <div className="absolute top-[34%] h-[10%] right-[40%] left-[40%]">
        {/* Blank center */}

        {/* Text */}
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-contain scale-75 -mt-4"
          style={{
            backgroundImage: `url(${logo})`,
          }}
        ></div>
      </div>
      <div className="absolute top-[34%] h-[20%] right-[10%] w-[19%]">
        {/* Blank right */}

        {/* Icon */}
        <ConfigSwitch configKey="rightMode" value="icon">
          <CurrentIcon />
        </ConfigSwitch>

        <ConfigSwitch configKey="rightMode" value="people">
          <PeopleCount />
        </ConfigSwitch>

        <ConfigSwitch configKey="rightMode" value="garten">
          <GartenLogo />
        </ConfigSwitch>
      </div>
    </div>
  );
}

export const $currentIcon = atom({ index: 24 });

function CurrentIcon() {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const iconRef = ref(database, `experiments/thai/icon`);
    const unsubscribe = onValue(iconRef, (snapshot) => {
      const val = snapshot.val();
      const index = val ? val.index : 24;
      $currentIcon.set({ index });
    });
    return unsubscribe;
  }, []);
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

function PeopleCount() {
  const dbRef = ref(database, `experiments/thai/presence`);
  const presence = useStore(getFirebaseDatabaseQueryStore(dbRef));
  const count = presence.data?.size || 0;
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-7xl font-black">{count}</div>
      <div className="text-xl">People joined</div>
    </div>
  );
}

function GartenLogo() {
  return (
    <div className="flex justify-center">
      <img src={garten} alt="" className="w-[80%]" />
    </div>
  );
}
