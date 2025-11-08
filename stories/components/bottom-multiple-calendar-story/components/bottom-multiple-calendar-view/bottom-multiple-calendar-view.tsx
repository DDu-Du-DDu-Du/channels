import { useMemo, useState } from "react";
import { View } from "react-native";

import { BottomMultipleCalendar, SpoqaText } from "@/components";

export interface BottomMultipleCalendarViewProps {
  initialSelected?: string[]; // YYYY-MM-DD
  onChangeSelected?: (dates: Date[]) => void;
}

function BottomMultipleCalendarView({
  initialSelected = [],
  onChangeSelected,
}: BottomMultipleCalendarViewProps) {
  const initial = useMemo(() => initialSelected.map((d) => new Date(d)), [initialSelected]);
  const [selected, setSelected] = useState<Date[]>(initial);

  return (
    <View className="flex-1 items-center justify-center p-4">
      <View className="w-full max-w-[50rem]">
        <BottomMultipleCalendar
          selected={selected}
          setSelected={(dates) => {
            const next = dates ?? [];
            setSelected(next);
            onChangeSelected?.(next);
          }}
        />
        <View className="mt-[1rem]">
          <SpoqaText className="text-size13">선택된 날짜 수: {selected.length}</SpoqaText>
        </View>
      </View>
    </View>
  );
}

export default BottomMultipleCalendarView;
