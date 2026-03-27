import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

interface UseTodoEditProps {
  setIsCreateTodo: Dispatch<SetStateAction<boolean>>;
}

const useTodoEdit = ({ setIsCreateTodo }: UseTodoEditProps) => {
  const [currentTodoId, setCurrentTodoId] = useState(-1);
  const [editTodoId, setEditTodoId] = useState(-1);

  const handleCloseTodoInput = () => {
    setIsCreateTodo(false);
    setEditTodoId(-1);
    setCurrentTodoId(-1);
    console.log("close");
  };

  const handleUpdateEditTodoId = (id: number) => {
    setEditTodoId(id);
    console.log(id);
  };

  return {
    currentTodoId,
    editTodoId,
    setCurrentTodoId,
    handleCloseTodoInput,
    handleUpdateEditTodoId,
  };
};

export default useTodoEdit;
