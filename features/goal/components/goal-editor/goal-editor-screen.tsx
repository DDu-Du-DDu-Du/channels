import { useMemo, useState } from "react";
import { View } from "react-native";

import { ColorSheet, ConfirmModal, FormHeader, SpoqaText } from "@/components";
import { useColorSheet } from "@/features/goal/components/goal-editor-form/hooks";
import {
  RepeatDduduItemType,
  RepeatDduduListView,
  RepeatDduduSheet,
  useRepeatDduduListController,
  useRepeatDduduMutation,
  useRepeatSheet,
} from "@/features/repeat-ddudu";
import { usePressBack } from "@/hooks";

import { GoalEditFormView } from "./components";
import { useGoalDetailQuery, useGoalEditMutation } from "./hooks";

export interface GoalEditorScreenProps {
  goalId: number;
}

type EditorViewMode = "form" | "repeatList";

function GoalEditorScreen({ goalId }: GoalEditorScreenProps) {
  const { handlePressBack } = usePressBack();
  const [viewMode, setViewMode] = useState<EditorViewMode>("form");
  const [isCreateRepeatMode, setIsCreateRepeatMode] = useState(true);
  const [isGoalDeleteConfirmOpen, setIsGoalDeleteConfirmOpen] = useState(false);

  const { data: goalDetail, isPending, isError } = useGoalDetailQuery({ goalId });
  const { ref, closeSheet, handlePressOpenRepeatSheet } = useRepeatSheet();
  const {
    handleCreateRepeatDdudu,
    handleEditRepeatDdudu,
    handleDeleteRepeatDdudu: onDeleteRepeatDdudu,
  } = useRepeatDduduMutation({ goalId });
  const {
    isDeleteConfirmOpen,
    selectedRepeatDdudu,
    handlePressRepeatDdudu,
    handleClearSelectedRepeatDdudu,
    handlePressDeleteRepeatDdudu,
    handleCompleteDeleteRepeatDdudu,
    handleCloseDeleteModal,
  } = useRepeatDduduListController({
    onDeleteRepeatDdudu,
  });
  const { handleTerminateGoal, handleDeleteGoal } = useGoalEditMutation({
    goalId,
    defaultTitle: goalDetail?.name ?? "",
    pickedColor: goalDetail?.color ?? "#FFFFFF",
    privacyType: goalDetail?.privacyType ?? "PUBLIC",
  });

  const {
    pickedColor,
    isColorSheetOpen,
    handlePressOpenColorSheet,
    handleCloseColorSheet,
    handlePickColor,
  } = useColorSheet({
    color: goalDetail?.color,
  });

  const repeatDdudus = useMemo<RepeatDduduItemType[]>(
    () => goalDetail?.repeatDdudus ?? [],
    [goalDetail?.repeatDdudus],
  );

  const handleOpenRepeatList = () => {
    setViewMode("repeatList");
  };

  const handleOpenCreateRepeatSheet = () => {
    setIsCreateRepeatMode(true);
    handleClearSelectedRepeatDdudu();
    handlePressOpenRepeatSheet();
  };

  const handleOpenEditRepeatSheet = (repeatDdudu: RepeatDduduItemType) => {
    setIsCreateRepeatMode(false);
    handlePressRepeatDdudu(repeatDdudu);
    handlePressOpenRepeatSheet();
  };

  const handleSubmitRepeatDdudu = (repeatDdudu: RepeatDduduItemType) => {
    if (isCreateRepeatMode) {
      handleCreateRepeatDdudu(repeatDdudu);
      return;
    }

    if (selectedRepeatDdudu?.id) {
      handleEditRepeatDdudu(selectedRepeatDdudu.id, repeatDdudu);
    }
  };

  const handleCloseRepeatSheet = () => {
    closeSheet();
    handleClearSelectedRepeatDdudu();
  };

  const handlePressDeleteGoal = () => {
    setIsGoalDeleteConfirmOpen(true);
  };

  const handleCompleteDeleteGoal = (isComplete: boolean) => {
    if (!isComplete) {
      return;
    }

    handleDeleteGoal();
  };

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <SpoqaText className="text-size14 text-white">{"목표 정보를 불러오는 중..."}</SpoqaText>
      </View>
    );
  }

  if (!goalDetail || isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <SpoqaText className="text-size14 text-white">
          {"목표 정보를 불러오지 못했습니다."}
        </SpoqaText>
      </View>
    );
  }

  return (
    <>
      {viewMode === "form" ? (
        <>
          <FormHeader
            title={"목표수정"}
            onPressBack={handlePressBack}
          />

          <GoalEditFormView
            goalId={goalId}
            defaultTitle={goalDetail.name}
            pickedColor={pickedColor}
            privacyType={goalDetail.privacyType}
            repeatDduduCount={repeatDdudus.length}
            onPressOpenColorSheet={handlePressOpenColorSheet}
            onPressOpenRepeatManagement={handleOpenRepeatList}
            onPressTerminateGoal={handleTerminateGoal}
            onPressDeleteGoal={handlePressDeleteGoal}
          />
        </>
      ) : (
        <RepeatDduduListView
          repeatDdudus={repeatDdudus}
          onPressBack={() => setViewMode("form")}
          onPressAdd={handleOpenCreateRepeatSheet}
          onPressRepeatDdudu={handleOpenEditRepeatSheet}
          onPressDeleteRepeatDdudu={handlePressDeleteRepeatDdudu}
          isDeleteConfirmOpen={isDeleteConfirmOpen}
          onCompleteDeleteRepeatDdudu={handleCompleteDeleteRepeatDdudu}
          onCloseDeleteModal={handleCloseDeleteModal}
        />
      )}

      <ColorSheet
        isShow={isColorSheetOpen}
        pickedColor={pickedColor}
        onClick={handlePickColor}
        onClose={handleCloseColorSheet}
      />

      <RepeatDduduSheet
        bottomSheetRef={ref}
        onClose={handleCloseRepeatSheet}
        onDismiss={handleClearSelectedRepeatDdudu}
        repeatDdudu={selectedRepeatDdudu}
        sheetTitle={isCreateRepeatMode ? "반복 생성" : "반복 수정"}
        submitLabel={isCreateRepeatMode ? "반복 생성" : "반복 수정"}
        onSubmit={handleSubmitRepeatDdudu}
      />

      <ConfirmModal
        isToggle={isGoalDeleteConfirmOpen}
        title={"목표를 삭제할까요?"}
        message={"삭제 후에는 되돌릴 수 없습니다."}
        completeText={"삭제"}
        incompleteText={"취소"}
        handleToggleOff={() => setIsGoalDeleteConfirmOpen(false)}
        onCompleteCheck={handleCompleteDeleteGoal}
      />
    </>
  );
}

export default GoalEditorScreen;
