import { useStore } from "@nanostores/react";
import clsx from "clsx";
import { ref } from "firebase/database";
import { createContext, useContext } from "react";
import { colors } from "~/colors";
import { database } from "~/firebase.client";
import { getFirebaseDatabaseQueryStore } from "~/nanofire";
import arc1 from "./arc1.png";
import arc2 from "./arc2.png";

export interface MuseumContext {
  onSegmentClick?: (index: number) => void;
  renderSegmentChildren?: (index: number) => React.ReactNode;
}
export const MuseumContext = createContext<MuseumContext>({});

export function Museum() {
  return (
    <div
      className="flex flex-1 bg-white"
      style={
        {
          "--pillar-xw": "118",
          "--window-xw": "322",
          "--above-yw": "289",
          "--below-yw": "727",
          "--door-yp": "50%",
          "--door-s-xp": "15%",
          "--door-l-xp": "0%",
          "--curve-s-ys": "12%",
          "--curve-s-xp": "8%",
          "--curve-l-ys": "27%",
          "--curve-ym": "52%",
        } as React.CSSProperties
      }
    >
      <div className="relative flex-[--pillar-xw] drop-s z-20">
        <Segment index={1} />
      </div>
      <div className="relative flex-[--window-xw] flex flex-col">
        <div className="relative flex-[--above-yw] drop-s z-10">
          <Segment index={5} />
        </div>
        <div className="relative flex-[--below-yw]">
          <Segment index={8} />
          <div className="absolute inset-x-[--curve-s-xp] bottom-[--curve-ym] h-[--curve-s-ys] drop-s z-10">
            <Segment index={11} mask={arc1} />
          </div>
          <div className="absolute inset-x-[--door-s-xp] bottom-0 h-[--door-yp] drop-s z-10">
            <Segment index={14} />
          </div>
        </div>
      </div>
      <div className="relative flex-[--pillar-xw] drop-s z-20">
        <Segment index={2} />
      </div>
      <div className="relative flex-[--window-xw] flex flex-col">
        <div className="relative flex-[--above-yw] drop-s z-10">
          <Segment index={6} />
        </div>
        <div className="relative flex-[--below-yw]">
          <Segment index={9} />
          <div className="absolute inset-x-[--door-l-xp] bottom-[--curve-ym] h-[--curve-l-ys] drop-s z-10">
            <Segment index={12} mask={arc2} />
          </div>
          <div className="absolute inset-x-[--door-l-xp] bottom-0 h-[--door-yp] drop-s z-10">
            <Segment index={15} />
          </div>
        </div>
      </div>
      <div className="relative flex-[--pillar-xw] drop-s z-20">
        <Segment index={3} />
      </div>
      <div className="relative flex-[--window-xw] flex flex-col">
        <div className="relative flex-[--above-yw] drop-s z-10">
          <Segment index={7} />
        </div>
        <div className="relative flex-[--below-yw]">
          <Segment index={10} />
          <div className="absolute inset-x-[--curve-s-xp] bottom-[--curve-ym] h-[--curve-s-ys] drop-s z-10">
            <Segment index={13} mask={arc1} />
          </div>
          <div className="absolute inset-x-[--door-s-xp] bottom-0 h-[--door-yp] drop-s z-10">
            <Segment index={16} />
          </div>
        </div>
      </div>
      <div className="relative flex-[--pillar-xw] drop-s z-20">
        <Segment index={4} />
      </div>
    </div>
  );
}
interface Segment {
  index: number;
  mask?: string;
}
function Segment(props: Segment) {
  const currentColor = useCurrentColor(props.index);
  const { onSegmentClick, renderSegmentChildren } = useContext(MuseumContext);
  const Component = onSegmentClick != null ? "button" : "div";
  return (
    <Component
      className={clsx(
        "absolute inset-0",
        onSegmentClick ? "segment-button" : "segment-view"
      )}
      style={{
        backgroundColor: currentColor != null ? colors[currentColor] : "gray",
        ...(props.mask
          ? { maskImage: `url(${props.mask})`, maskSize: "100% 100%" }
          : {}),
      }}
      onClick={() => {
        if (onSegmentClick != null) {
          onSegmentClick(props.index);
        }
      }}
    >
      {renderSegmentChildren ? renderSegmentChildren(props.index) : null}
    </Component>
  );
}
function useCurrentColor(index: number) {
  const store = getFirebaseDatabaseQueryStore(
    ref(database, `experiments/thai/segments/${index}/color/value`)
  );
  const snapshot = useStore(store);
  const val = snapshot.data?.val();
  return typeof val === "number" ? val : null;
}
