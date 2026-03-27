import React from "react";
import { View } from "react-native";

import { SpoqaText } from "@/components";
import TodosubMenu from "@/components/todo-sheet/components/todo-sub-menu/todo-sub-menu";
import type { TodoDetailType } from "@/components/todo-sheet/todo-sheet.types";
import { formatDateToYYYYMMDD } from "@/utils";

export interface TodosubMenuViewProps {
  TodoDetail?: TodoDetailType;
  handleSelectDifferentDate?: (type: "change" | "repeat", currentDate: string) => void;
  handleAlarmSetting?: () => void;
  onRepeatCurrentDate?: () => void;
}

function TodosubMenuView({
  TodoDetail = {
    id: 1,
    name: "Sample",
    status: "UNCOMPLETED",
    goalId: 1,
    repeatTodoId: 0,
    scheduledOn: formatDateToYYYYMMDD(new Date()),
    beginAt: null,
    endAt: null,
  },
  handleSelectDifferentDate,
  handleAlarmSetting,
  onRepeatCurrentDate,
}: TodosubMenuViewProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <TodosubMenu
        TodoDetail={TodoDetail}
        handleSelectDifferentDate={(t, d) => handleSelectDifferentDate?.(t, d)}
        handleAlarmSetting={() => handleAlarmSetting?.()}
        onRepeatCurrentDate={() => onRepeatCurrentDate?.()}
      />
      <SpoqaText className="mt-4 text-role-text-tertiary dark:text-role-dark-text-tertiary">
        Sub menu preview
      </SpoqaText>
    </View>
  );
}

export default TodosubMenuView;
