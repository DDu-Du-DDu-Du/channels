import { ColorSheet, FormHeader } from "@/components";
import { RepeatTodosheet, useRepeatSheet, useRepeatTodostate } from "@/features/repeat-todo";
import { usePressBack } from "@/hooks";
import { GoalType } from "@/types/response/goal/goal";

import { GoalEditorFormBody } from "./components";
import { useColorSheet } from "./hooks";

export interface GoalEditorFormProps {
  pageTitle: string;
  submitLabel: string;
  goal?: GoalType;
  defaultTitle?: string;
}

function GoalEditorForm({ pageTitle, submitLabel, goal, defaultTitle = "" }: GoalEditorFormProps) {
  const { handlePressBack } = usePressBack();
  const initialTitle = goal?.name ?? defaultTitle;
  const {
    pickedColor,
    isColorSheetOpen,
    handlePressOpenColorSheet,
    handleCloseColorSheet,
    handlePickColor,
  } = useColorSheet({
    color: goal?.color,
  });
  const { ref, closeSheet, handlePressOpenRepeatSheet } = useRepeatSheet();
  const {
    repeatTodos,
    selectedRepeatTodo,
    handlePrepareCreateRepeatTodo,
    handleSelectRepeatTodo,
    handleClearSelectedRepeatTodo,
    handleSaveRepeatTodo,
    handleDeleteRepeatTodo,
  } = useRepeatTodostate();

  const handleOpenCreateRepeatSheet = () => {
    handlePrepareCreateRepeatTodo();
    handlePressOpenRepeatSheet();
  };

  const handlePressRepeatTodoCard = (index: number) => {
    handleSelectRepeatTodo(index);
    handlePressOpenRepeatSheet();
  };

  const handleCloseRepeatSheet = () => {
    closeSheet();
    handleClearSelectedRepeatTodo();
  };

  const handleDismissRepeatSheet = () => {
    handleClearSelectedRepeatTodo();
  };

  return (
    <>
      <FormHeader
        title={pageTitle}
        onPressBack={handlePressBack}
      />

      <GoalEditorFormBody
        submitLabel={submitLabel}
        defaultTitle={initialTitle}
        pickedColor={pickedColor}
        repeatTodos={repeatTodos}
        onPressOpenColorSheet={handlePressOpenColorSheet}
        onPressOpenRepeatSheet={handleOpenCreateRepeatSheet}
        onPressRepeatTodoCard={handlePressRepeatTodoCard}
        onPressDeleteRepeatTodoCard={handleDeleteRepeatTodo}
      />

      <ColorSheet
        isShow={isColorSheetOpen}
        pickedColor={pickedColor}
        onClick={handlePickColor}
        onClose={handleCloseColorSheet}
      />

      <RepeatTodosheet
        bottomSheetRef={ref}
        onClose={handleCloseRepeatSheet}
        onDismiss={handleDismissRepeatSheet}
        repeatTodo={selectedRepeatTodo}
        sheetTitle={"반복 생성"}
        onSubmit={handleSaveRepeatTodo}
      />
    </>
  );
}

export default GoalEditorForm;
