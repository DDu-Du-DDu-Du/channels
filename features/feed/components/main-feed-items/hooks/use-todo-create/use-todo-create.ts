import { useState } from "react";

interface UseTodoCreateProps {
  status?: "IN_PROGRESS" | "DONE";
  handleAlertModalToggleOn?: () => void;
}

const useTodoCreate = ({ status, handleAlertModalToggleOn }: UseTodoCreateProps) => {
  const [isCreateTodo, setIsCreateTodo] = useState(false);

  const handleOpenTodoInput = () => {
    if (status === "DONE") {
      handleAlertModalToggleOn?.();
      return;
    }

    setIsCreateTodo(true);
  };

  return {
    isCreateTodo,
    setIsCreateTodo,
    handleOpenTodoInput,
  };
};

export default useTodoCreate;
