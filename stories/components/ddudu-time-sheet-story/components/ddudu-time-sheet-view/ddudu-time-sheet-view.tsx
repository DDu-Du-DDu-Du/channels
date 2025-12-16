import { useState } from "react";
import { Pressable, View } from "react-native";

import { DDuDuTimeSheet, SpoqaText } from "@/components";
import type { DDuDuTimeRangeType, DDuDuTimeType } from "@/features/feed/feed.types";

export interface DDuDuTimeSheetViewProps {
  onClose?: () => void;
  onChangeDDuDuTime?: (selectedTime: DDuDuTimeRangeType) => void;
}

function DDuDuTimeSheetView({ onClose, onChangeDDuDuTime }: DDuDuTimeSheetViewProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<DDuDuTimeType>({ beginAt: "09:00", endAt: "10:00" });

  const toStr = (n: number) => String(n).padStart(2, "0");

  const handleChange = (range: DDuDuTimeRangeType) => {
    setCurrent({
      beginAt: `${toStr(range.beginHour)}:${toStr(range.beginMin)}`,
      endAt: `${toStr(range.endHour)}:${toStr(range.endMin)}`,
    });
    onChangeDDuDuTime?.(range);
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      {!open ? (
        <Pressable
          onPress={() => setOpen(true)}
          className="px-4 py-2 bg-example_gray_700 rounded-radius10"
        >
          <SpoqaText className="text-white">Open DDuDuTimeSheet</SpoqaText>
        </Pressable>
      ) : (
        <DDuDuTimeSheet
          currentDDuDuTime={current}
          onChangeDDuDuTime={handleChange}
          onClose={() => {
            onClose?.();
            setOpen(false);
          }}
        />
      )}
    </View>
  );
}

export default DDuDuTimeSheetView;
