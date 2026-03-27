import { useState } from "react";

import type { RepeatTodoItemType } from "@/features/repeat-todo/repeat-todo.types";
import { useToggle } from "@/hooks";

interface UseRepeatTodoListControllerProps {
  onDeleteRepeatTodo: (repeatTodoId: number) => void;
}

function useRepeatTodoListController({ onDeleteRepeatTodo }: UseRepeatTodoListControllerProps) {
  const { isToggle, handleToggleOn, handleToggleOff } = useToggle();
  const [selectedRepeatTodo, setSelectedRepeatTodo] = useState<RepeatTodoItemType>();
  const [targetDeleteRepeatTodoId, setTargetDeleteRepeatTodoId] = useState<number>();

  const handlePressRepeatTodo = (repeatTodo: RepeatTodoItemType) => {
    setSelectedRepeatTodo(repeatTodo);
  };

  const handleClearSelectedRepeatTodo = () => {
    setSelectedRepeatTodo(undefined);
  };

  const handlePressDeleteRepeatTodo = (repeatTodoId?: number) => {
    if (!repeatTodoId) {
      return;
    }

    setTargetDeleteRepeatTodoId(repeatTodoId);
    handleToggleOn();
  };

  const handleCompleteDeleteRepeatTodo = (isComplete: boolean) => {
    if (!isComplete || !targetDeleteRepeatTodoId) {
      return;
    }

    onDeleteRepeatTodo(targetDeleteRepeatTodoId);
    setTargetDeleteRepeatTodoId(undefined);
  };

  const handleCloseDeleteModal = () => {
    setTargetDeleteRepeatTodoId(undefined);
    handleToggleOff();
  };

  return {
    isDeleteConfirmOpen: isToggle,
    selectedRepeatTodo,
    handlePressRepeatTodo,
    handleClearSelectedRepeatTodo,
    handlePressDeleteRepeatTodo,
    handleCompleteDeleteRepeatTodo,
    handleCloseDeleteModal,
  };
}

export default useRepeatTodoListController;
