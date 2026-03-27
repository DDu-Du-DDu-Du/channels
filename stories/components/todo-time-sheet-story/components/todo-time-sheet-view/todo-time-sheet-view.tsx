import { useState } from "react";
import { Pressable, View } from "react-native";

import { SpoqaText, TodoTimeSheet } from "@/components";
import type { TodoTimeRangeType, TodoTimeType } from "@/features/feed/feed.types";

export interface TodoTimeSheetViewProps {
  onClose?: () => void;
  onChangeTodoTime?: (selectedTime: TodoTimeRangeType) => void;
}

function TodoTimeSheetView({ onClose, onChangeTodoTime }: TodoTimeSheetViewProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<TodoTimeType>({ beginAt: "09:00", endAt: "10:00" });

  const toStr = (n: number) => String(n).padStart(2, "0");

  const handleChange = (range: TodoTimeRangeType) => {
    setCurrent({
      beginAt: `${toStr(range.beginHour)}:${toStr(range.beginMin)}`,
      endAt: `${toStr(range.endHour)}:${toStr(range.endMin)}`,
    });
    onChangeTodoTime?.(range);
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      {!open ? (
        <Pressable
          onPress={() => setOpen(true)}
          className="px-4 py-2 bg-role-surface-muted dark:bg-role-dark-surface-muted rounded-radius10"
        >
          <SpoqaText className="text-role-text-inverse dark:text-role-dark-text-inverse">
            Open TodoTimeSheet
          </SpoqaText>
        </Pressable>
      ) : (
        <TodoTimeSheet
          currentTodoTime={current}
          onChangeTodoTime={handleChange}
          onClose={() => {
            onClose?.();
            setOpen(false);
          }}
        />
      )}
    </View>
  );
}

export default TodoTimeSheetView;
