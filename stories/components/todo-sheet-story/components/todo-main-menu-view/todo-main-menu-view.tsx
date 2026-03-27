import React from "react";
import { View } from "react-native";

import { SpoqaText } from "@/components";
import TodoMainMenu from "@/components/todo-sheet/components/todo-main-menu/todo-main-menu";
import type { TodoDetailType } from "@/components/todo-sheet/todo-sheet.types";
import { formatDateToYYYYMMDD } from "@/utils";

export interface TodoMainMenuViewProps {
  type?: "Todo" | "schedule";
  TodoId?: number;
  TodoDetail?: TodoDetailType;
  handleEditTodo?: (id: number) => void;
  onDeleteTodo?: (id: number) => void;
  handleTodoTimeSetting?: (beginAt?: string, endAt?: string) => void;
  handleTodosheetToggleOff?: () => void;
}

function TodoMainMenuView({
  type = "Todo",
  TodoId = 1,
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
  handleEditTodo,
  onDeleteTodo,
  handleTodoTimeSetting,
  handleTodosheetToggleOff,
}: TodoMainMenuViewProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <TodoMainMenu
        type={type}
        TodoId={TodoId}
        TodoDetail={TodoDetail}
        handleEditTodo={(id) => handleEditTodo?.(id)}
        onDeleteTodo={(id) => onDeleteTodo?.(id)}
        handleTodoTimeSetting={(b?, e?) => handleTodoTimeSetting?.(b, e)}
        handleTodosheetToggleOff={() => handleTodosheetToggleOff?.()}
      />
      <SpoqaText className="mt-4 text-role-text-tertiary dark:text-role-dark-text-tertiary">
        Main menu preview
      </SpoqaText>
    </View>
  );
}

export default TodoMainMenuView;
