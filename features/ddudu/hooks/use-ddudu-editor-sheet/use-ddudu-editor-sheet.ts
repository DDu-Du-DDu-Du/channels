import { useState } from "react";

export interface DDuDuEditorSheetState {
  isOpen: boolean;
  mode: "create" | "edit";
  goalId?: number;
  dduduId?: number;
}

const initialState: DDuDuEditorSheetState = {
  isOpen: false,
  mode: "create",
};

const useDDuDuEditorSheet = () => {
  const [state, setState] = useState<DDuDuEditorSheetState>(initialState);

  const handleOpenCreateEditor = (goalId: number) => {
    setState({
      isOpen: true,
      mode: "create",
      goalId,
      dduduId: undefined,
    });
  };

  const handleOpenEditEditor = (dduduId: number) => {
    setState({
      isOpen: true,
      mode: "edit",
      goalId: undefined,
      dduduId,
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

export default useDDuDuEditorSheet;
