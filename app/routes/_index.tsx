import { useStore } from "@nanostores/react";
import type { MetaFunction } from "@remix-run/node";
import clsx from "clsx";
import { ref, serverTimestamp, set } from "firebase/database";
import { atom } from "nanostores";
import { useEffect } from "react";
import { ConfigSwitch } from "~/ConfigSwitch";
import { colors } from "~/colors";
import { database } from "~/firebase.client";
import instruments from "~/instruments";
import { getFirebaseDatabaseQueryStore } from "~/nanofire";
import { Museum, MuseumContext } from "../Museum";

export const meta: MetaFunction = () => {
  return [
    { title: "a bit of coloring" },
    { name: "description", content: "a bit of coloring" },
  ];
};

export const $selectedColor = atom<number | null>(null);
export const $disabled = atom(false);

function onSegmentClick(index: number) {
  const colorToSet = $selectedColor.get();
  if ($disabled.get()) return;
  if (colorToSet != null) {
    set(ref(database, `experiments/thai/segments/${index}/color`), {
      value: colorToSet,
      timestamp: serverTimestamp(),
    });
    if (location.hostname !== "localhost") {
      $disabled.set(true);
      setTimeout(() => {
        $disabled.set(false);
      }, 2000);
    }
  }
}

export default function Index() {
  useEffect(() => {
    const id = (localStorage.thaitunesId ??=
      Date.now() + "-" + Math.random().toString(36).slice(2));
    const presenceRef = ref(database, `experiments/thai/presence/${id}`);
    set(presenceRef, serverTimestamp());
  }, []);
  return (
    <div>
      <div className="max-w-md mx-auto p-4">
        <strong>Pick a color...</strong>
        <div className="mt-2">
          <ColorSelector />
        </div>
        <div className="mt-4">
          <strong>Select a segment...</strong>
        </div>
        <div className="mt-2">
          <div className="flex [aspect-ratio:1.42]">
            <MuseumContext.Provider value={{ onSegmentClick }}>
              <Museum />
            </MuseumContext.Provider>
          </div>
        </div>

        <ConfigSwitch configKey="rightMode" value="icon">
          <div className="mt-8">
            <strong>Pick an icon...</strong>
            <IconPicker />
          </div>
        </ConfigSwitch>
      </div>
    </div>
  );
}

const noteName = "ซฺ ลฺ ด ร ม ซ ล ดํ รํ มํ ซํ ลํ".split(" ");
function ColorSelector() {
  const selectedColor = useStore($selectedColor);
  const disabled = useStore($disabled);
  const showNote = !!useStore(
    getFirebaseDatabaseQueryStore(
      ref(database, `experiments/thai/config/showNote`)
    )
  ).data?.val();
  return (
    <div className={clsx("grid grid-cols-6 gap-2", disabled && "opacity-50")}>
      {colors.map((color, index) => (
        <button
          key={color}
          className={clsx(
            "h-12 rounded-md text-xl",
            selectedColor === index && !disabled
              ? "ring-2 ring-white border-2 border-black/50"
              : "ring-0"
          )}
          style={{
            backgroundColor: color,
            color:
              index === 2 || index === 9 || index === 11 ? "black" : "white",
          }}
          onClick={() => $selectedColor.set(index)}
        >
          {showNote ? noteName[index] : ""}
        </button>
      ))}
    </div>
  );
}

function IconPicker() {
  const iconRef = ref(database, `experiments/thai/icon/index`);
  const iconSnapshot = useStore(getFirebaseDatabaseQueryStore(iconRef));
  const currentIndex = iconSnapshot.data?.val() ?? 0;
  return (
    <div className={clsx("grid grid-cols-6 gap-2")}>
      {instruments.map((instrument, index) => (
        <button
          key={index}
          className={clsx(
            "h-16 rounded-md bg-contain bg-center bg-no-repeat",
            currentIndex === index + 1 ? "bg-gray-700" : ""
          )}
          style={{ backgroundImage: `url(${instrument})` }}
          onClick={() => {
            set(ref(database, `experiments/thai/icon`), {
              index: index + 1,
              timestamp: serverTimestamp(),
            });
          }}
        />
      ))}
    </div>
  );
}
