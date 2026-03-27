import { useState } from "react";

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

  const handleTodoTimeSetting = (beginAt: string | null = null, endAt: string | null = null) => {
    setCurrentTodoTime({ beginAt, endAt });
    handleTodoTimeSheetToggleOn();
    handleTodosheetToggleOff();
  };

  const handleUpdateTodoTime = (updateTime: TodoTimeType) => {
    setCurrentTodoTime(updateTime);
  };

  return { currentTodoTime, handleTodoTimeSetting, handleUpdateTodoTime };
};

export default useTodoTime;
