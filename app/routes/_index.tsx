import { useStore } from "@nanostores/react";
import type { MetaFunction } from "@remix-run/node";
import clsx from "clsx";
import { ref, serverTimestamp, set } from "firebase/database";
import { atom } from "nanostores";
import { colors } from "~/colors";
import { database } from "~/firebase.client";
import instruments from "~/instruments";
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

        <div className="mt-8">
          <strong>Pick an icon...</strong>
          <IconPicker />
        </div>
      </div>
    </div>
  );
}

function ColorSelector() {
  const selectedColor = useStore($selectedColor);
  const disabled = useStore($disabled);
  return (
    <div className={clsx("grid grid-cols-6 gap-2", disabled && "opacity-50")}>
      {colors.map((color, index) => (
        <button
          key={color}
          className={clsx(
            "h-12 rounded-md",
            selectedColor === index && !disabled
              ? "ring-2 ring-white border-2 border-black/50"
              : "ring-0"
          )}
          style={{ backgroundColor: color }}
          onClick={() => $selectedColor.set(index)}
        />
      ))}
    </div>
  );
}

function IconPicker() {
  return (
    <div className={clsx("grid grid-cols-6 gap-2")}>
      {instruments.map((instrument, index) => (
        <button
          key={index}
          className={clsx("h-16 rounded-md bg-contain bg-center bg-no-repeat")}
          style={{ backgroundImage: `url(${instrument})` }}
        />
      ))}
    </div>
  );
}
