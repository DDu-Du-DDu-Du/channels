import { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";
import useClickAway from "@/hooks/use-click-away/use-click-away";

export interface WheelPickerProps {
  data: (string | number)[];
  value: number;
  onChange: (index: number) => void;
  itemHeight?: number;
  visibleCount?: number;
  initValue?: string | number;
}

function WheelPicker({ data, value, onChange, itemHeight = 44 }: WheelPickerProps) {
  const visibleCount = 3;
  const half = Math.floor(visibleCount / 2);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const rootRef = useClickAway<HTMLDivElement>(() => setExpanded(false));

  const topPadding = useMemo(() => half * itemHeight, [half, itemHeight]);

  useEffect(() => {
    const node = containerRef.current;

    if (!node || !expanded) {
      return;
    }

    const target = value * itemHeight;
    node.scrollTop = target;
  }, [value, itemHeight, expanded]);

  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      ref={rootRef}
      style={{ display: "flex", position: "relative" }}
    >
      <View
        className="items-center justify-center"
        style={{ height: itemHeight, width: 72 }}
      >
        {expanded ? (
          <div
            ref={containerRef}
            style={{
              position: "absolute",
              top: -itemHeight,
              left: 0,
              zIndex: 501,
              width: 72,
              height: itemHeight * visibleCount,
              overflowY: "auto",
              overscrollBehavior: "contain",
              // allow free scrolling; no CSS snap
              touchAction: "pan-y",
              paddingTop: topPadding,
              paddingBottom: topPadding,
              margin: 0,
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "white",
              // hide scrollbar fallbacks
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
            className="scrollbar-hide"
          >
            {data.map((d, i) => (
              <div
                key={`opt-${i}`}
                style={{
                  height: itemHeight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: hovered === i ? "rgba(0,0,0,0.04)" : "transparent",
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  if (i !== value) onChange(i);
                  setExpanded(false);
                }}
              >
                <SpoqaText
                  className={i === value ? "text-size15" : "text-size13 text-example_gray_800"}
                >
                  {String(d)}
                </SpoqaText>
              </div>
            ))}
          </div>
        ) : null}
        {expanded ? (
          // placeholder to preserve width/height in normal flow beneath absolute overlay
          <div style={{ width: 72, height: itemHeight, visibility: "hidden" }} />
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setExpanded(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setExpanded(true);
            }}
            style={{
              width: 72,
              height: itemHeight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "white",
              cursor: "pointer",
            }}
          >
            <SpoqaText className="text-size15">{String(data[value] ?? "")}</SpoqaText>
          </div>
        )}
      </View>
    </div>
  );
}

export default WheelPicker;
