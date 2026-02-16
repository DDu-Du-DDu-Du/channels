import { ColorSheet, FormHeader } from "@/components";
import { usePressBack } from "@/hooks";
import { GoalType } from "@/types/response/goal/goal";

import { GoalEditorFormBody, RepeatDduduSheet } from "./components";
import { useColorSheet, useRepeatDdudu, useRepeatSheet } from "./hooks";

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
    repeatDdudus,
    selectedRepeatDdudu,
    handlePrepareCreateRepeatDdudu,
    handleSelectRepeatDdudu,
    handleClearSelectedRepeatDdudu,
    handleSaveRepeatDdudu,
  } = useRepeatDdudu();

  const handleOpenCreateRepeatSheet = () => {
    handlePrepareCreateRepeatDdudu();
    handlePressOpenRepeatSheet();
  };

  const handlePressRepeatDduduCard = (index: number) => {
    handleSelectRepeatDdudu(index);
    handlePressOpenRepeatSheet();
  };

  const handleCloseRepeatSheet = () => {
    closeSheet();
    handleClearSelectedRepeatDdudu();
  };

  const handleDismissRepeatSheet = () => {
    handleClearSelectedRepeatDdudu();
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
        repeatDdudus={repeatDdudus}
        onPressOpenColorSheet={handlePressOpenColorSheet}
        onPressOpenRepeatSheet={handleOpenCreateRepeatSheet}
        onPressRepeatDduduCard={handlePressRepeatDduduCard}
      />

      <ColorSheet
        isShow={isColorSheetOpen}
        pickedColor={pickedColor}
        onClick={handlePickColor}
        onClose={handleCloseColorSheet}
      />

      <RepeatDduduSheet
        bottomSheetRef={ref}
        onClose={handleCloseRepeatSheet}
        onDismiss={handleDismissRepeatSheet}
        repeatDdudu={selectedRepeatDdudu}
        sheetTitle={"반복 생성"}
        onSubmit={handleSaveRepeatDdudu}
      />
    </>
  );
}

export default GoalEditorForm;
