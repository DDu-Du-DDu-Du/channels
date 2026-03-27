import { View } from "react-native";

import TimeItem, { TimeItemProps } from "@/components/timeline/components/time-item/time-item";
import type { MainTimeTableTodoType } from "@/types/response/feed/feed";

export interface TimeItemViewProps {
  TodoId?: number;
  name?: string;
  status?: MainTimeTableTodoType["status"];
  beginAt?: string;
  endAt?: string;
  color?: string;
  isFirstItem?: boolean;
  isLastItem?: boolean;
  onTodoCompleteToggle?: TimeItemProps["onTodoCompleteToggle"];
  onTodosheetOpen?: TimeItemProps["onTodosheetOpen"];
}

function TimeItemView({
  TodoId = 1,
  name = "샘플 디두",
  status = "UNCOMPLETED",
  beginAt = "09:00",
  endAt = "10:00",
  color = "1363DE",
  isFirstItem = false,
  isLastItem = false,
  onTodoCompleteToggle,
  onTodosheetOpen,
}: TimeItemViewProps) {
  const Todo: MainTimeTableTodoType = {
    id: TodoId,
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
        Todo={Todo}
        isFirstItem={isFirstItem}
        isLastItem={isLastItem}
        onTodoCompleteToggle={onTodoCompleteToggle ?? (() => {})}
        onTodosheetOpen={onTodosheetOpen ?? (() => {})}
      />
    </View>
  );
}

export default TimeItemView;
