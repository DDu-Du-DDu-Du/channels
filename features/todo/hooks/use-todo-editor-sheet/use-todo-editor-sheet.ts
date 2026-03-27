import { useState } from "react";

export interface TodoEditorSheetState {
  isOpen: boolean;
  mode: "create" | "edit";
  goalId?: number;
  TodoId?: number;
}

const initialState: TodoEditorSheetState = {
  isOpen: false,
  mode: "create",
};

const useTodoEditorSheet = () => {
  const [state, setState] = useState<TodoEditorSheetState>(initialState);

  const handleOpenCreateEditor = (goalId: number) => {
    setState({
      isOpen: true,
      mode: "create",
      goalId,
      TodoId: undefined,
    });
  };

  const handleOpenEditEditor = (TodoId: number) => {
    setState({
      isOpen: true,
      mode: "edit",
      goalId: undefined,
      TodoId,
    });
  };

  const handleCloseEditor = () => {
    setState(initialState);
  };

  return {
    editorSheetState: state,
    handleOpenCreateEditor,
    handleOpenEditEditor,
    handleCloseEditor,
  };
};

export default useTodoEditorSheet;
