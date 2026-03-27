import { useMemo, useState } from "react";

import type { RepeatTodoRequestType } from "@/types/request/repeat-todo/repeat-todo";

import type { RepeatTodoItemType } from "../../repeat-todo.types";

function toTimeWithSecond(time?: string) {
  if (!time) {
    return undefined;
  }

  if (time.length === 8) {
    return time;
  }

  if (time.length === 5) {
    return `${time}:00`;
  }

  return time;
}

function createTempId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isSameRepeatTodo(
  repeatTodo: RepeatTodoItemType,
  target: { id?: number; tempId?: string },
) {
  if (target.id && repeatTodo.id) {
    return repeatTodo.id === target.id;
  }

  if (target.tempId && repeatTodo.tempId) {
    return repeatTodo.tempId === target.tempId;
  }

  return false;
}

function useRepeatTodostate() {
  const [repeatTodos, setRepeatTodos] = useState<RepeatTodoItemType[]>([]);
  const [selectedRepeatTodoIndex, setSelectedRepeatTodoIndex] = useState<number | null>(null);

  const selectedRepeatTodo = useMemo(() => {
    if (selectedRepeatTodoIndex === null) {
      return undefined;
    }

    return repeatTodos[selectedRepeatTodoIndex];
  }, [repeatTodos, selectedRepeatTodoIndex]);

  const handlePrepareCreateRepeatTodo = () => {
    setSelectedRepeatTodoIndex(null);
  };

  const handleSelectRepeatTodo = (index: number) => {
    setSelectedRepeatTodoIndex(index);
  };

  const handleClearSelectedRepeatTodo = () => {
    setSelectedRepeatTodoIndex(null);
  };

  const handleSaveRepeatTodo = (repeatTodo: RepeatTodoRequestType) => {
    const nextRepeatTodo: RepeatTodoRequestType = {
      ...repeatTodo,
      beginAt: toTimeWithSecond(repeatTodo.beginAt),
      endAt: toTimeWithSecond(repeatTodo.endAt),
    };

    setRepeatTodos((prev) => {
      if (selectedRepeatTodoIndex === null) {
        return [...prev, { ...nextRepeatTodo, tempId: createTempId() }];
      }

      return prev.map((item, index) =>
        index === selectedRepeatTodoIndex ? { ...item, ...nextRepeatTodo } : item,
      );
    });

    setSelectedRepeatTodoIndex(null);
  };

  const handleDeleteRepeatTodo = (target: { id?: number; tempId?: string }) => {
    setRepeatTodos((prev) => {
      const deleteIndex = prev.findIndex((repeatTodo) => isSameRepeatTodo(repeatTodo, target));

      if (deleteIndex < 0) {
        return prev;
      }

      setSelectedRepeatTodoIndex((currentIndex) => {
        if (currentIndex === null) {
          return null;
        }

        if (currentIndex === deleteIndex) {
          return null;
        }

        if (currentIndex > deleteIndex) {
          return currentIndex - 1;
        }

        return currentIndex;
      });

      return prev.filter((_, index) => index !== deleteIndex);
    });
  };

  const handleResetRepeatTodos = () => {
    setRepeatTodos([]);
    setSelectedRepeatTodoIndex(null);
  };

  return {
    repeatTodos,
    selectedRepeatTodo,
    handlePrepareCreateRepeatTodo,
    handleSelectRepeatTodo,
    handleClearSelectedRepeatTodo,
    handleSaveRepeatTodo,
    handleDeleteRepeatTodo,
    handleResetRepeatTodos,
  };
}

export default useRepeatTodostate;
