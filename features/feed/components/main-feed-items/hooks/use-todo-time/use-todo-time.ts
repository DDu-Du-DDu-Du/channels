import { useState } from "react";

import type { TodoDetailType } from "@/components/todo-sheet/todo-sheet.types";
import type { TodoTimeType } from "@/features/feed/feed.types";

interface UseTodoTimeProps {
  handleTodoTimeSheetToggleOn: () => void;
  handleTodosheetToggleOff: () => void;
}

const useTodoTime = ({
  handleTodoTimeSheetToggleOn,
  handleTodosheetToggleOff,
}: UseTodoTimeProps) => {
  const [currentTodoTime, setCurrentTodoTime] = useState<TodoTimeType>({
    beginAt: null,
    endAt: null,
  });
  const [currentTodoSchedule, setCurrentTodoSchedule] = useState<{
    scheduledOn: string;
    reminders: NonNullable<TodoDetailType["reminders"]>;
  }>({
    scheduledOn: "",
    reminders: [],
  });

  const handleTodoTimeSetting = (
    beginAt: string | null = null,
    endAt: string | null = null,
    scheduledOn: string = "",
    reminders: TodoDetailType["reminders"] = [],
  ) => {
    setCurrentTodoTime({ beginAt, endAt });
    setCurrentTodoSchedule({
      scheduledOn,
      reminders: reminders ?? [],
    });
    handleTodoTimeSheetToggleOn();
    handleTodosheetToggleOff();
  };

  const handleUpdateTodoTime = (updateTime: TodoTimeType) => {
    setCurrentTodoTime(updateTime);
  };

  return { currentTodoTime, currentTodoSchedule, handleTodoTimeSetting, handleUpdateTodoTime };
};

export default useTodoTime;
