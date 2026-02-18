import { View } from "react-native";

import TimeItem, { TimeItemProps } from "@/components/timeline/components/time-item/time-item";
import type { MainTimeTableDDuDuType } from "@/types/response/feed/feed";

export interface TimeItemViewProps {
  dduduId?: number;
  name?: string;
  status?: MainTimeTableDDuDuType["status"];
  beginAt?: string;
  endAt?: string;
  color?: string;
  isFirstItem?: boolean;
  isLastItem?: boolean;
  onDDuDuCompleteToggle?: TimeItemProps["onDDuDuCompleteToggle"];
  onDDuDuSheetOpen?: TimeItemProps["onDDuDuSheetOpen"];
}

function TimeItemView({
  dduduId = 1,
  name = "샘플 디두",
  status = "UNCOMPLETED",
  beginAt = "09:00",
  endAt = "10:00",
  color = "1363DE",
  isFirstItem = false,
  isLastItem = false,
  onDDuDuCompleteToggle,
  onDDuDuSheetOpen,
}: TimeItemViewProps) {
  const ddudu: MainTimeTableDDuDuType = {
    id: dduduId,
    name,
    status,
    goalId: 1,
    beginAt,
    endAt,
    color,
  };

  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <TimeItem
        ddudu={ddudu}
        isFirstItem={isFirstItem}
        isLastItem={isLastItem}
        onDDuDuCompleteToggle={onDDuDuCompleteToggle ?? (() => {})}
        onDDuDuSheetOpen={onDDuDuSheetOpen ?? (() => {})}
      />
    </View>
  );
}

export default TimeItemView;
