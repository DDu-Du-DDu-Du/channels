import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";

import { ColorSheet, ConfirmModal, SpoqaText } from "@/components";
import { useColorSheet } from "@/features/goal/components/goal-editor-form/hooks";
import {
  RepeatTodoItemType,
  RepeatTodoListView,
  RepeatTodosheet,
  useRepeatSheet,
  useRepeatTodoListController,
  useRepeatTodoMutation,
} from "@/features/repeat-todo";

import { GoalEditFormView } from "./components";
import { useGoalDetailQuery, useGoalEditMutation } from "./hooks";

export interface GoalEditorScreenProps {
  goalId: number;
  redirectOnSuccess?: boolean;
  invalidateFeedOnSuccess?: boolean;
  onMutationSuccess?: () => void;
  onEditorViewModeChange?: (viewMode: EditorViewMode) => void;
}

export type EditorViewMode = "form" | "repeatList";

function GoalEditorScreen({
  goalId,
  redirectOnSuccess,
  invalidateFeedOnSuccess,
  onMutationSuccess,
  onEditorViewModeChange,
}: GoalEditorScreenProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<EditorViewMode>("form");
  const [isCreateRepeatMode, setIsCreateRepeatMode] = useState(true);
  const [isGoalDeleteConfirmOpen, setIsGoalDeleteConfirmOpen] = useState(false);

  const { data: goalDetail, isPending, isError } = useGoalDetailQuery({ goalId });
  const { ref, closeSheet, handlePressOpenRepeatSheet } = useRepeatSheet();
  const {
    handleCreateRepeatTodo,
    handleEditRepeatTodo,
    handleDeleteRepeatTodo: onDeleteRepeatTodo,
  } = useRepeatTodoMutation({ goalId });
  const {
    isDeleteConfirmOpen,
    selectedRepeatTodo,
    handlePressRepeatTodo,
    handleClearSelectedRepeatTodo,
    handlePressDeleteRepeatTodo,
    handleCompleteDeleteRepeatTodo,
    handleCloseDeleteModal,
  } = useRepeatTodoListController({
    onDeleteRepeatTodo,
  });
  const { handleTerminateGoal, handleDeleteGoal } = useGoalEditMutation({
    goalId,
    defaultTitle: goalDetail?.name ?? "",
    pickedColor: goalDetail?.color ?? "#FFFFFF",
    privacyType: goalDetail?.privacyType ?? "PUBLIC",
    priority: goalDetail?.priority ?? 0,
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

  const repeatTodos = useMemo<RepeatTodoItemType[]>(
    () => goalDetail?.repeatTodos ?? [],
    [goalDetail?.repeatTodos],
  );

  const handleOpenRepeatList = () => {
    setViewMode("repeatList");
  };

  const handleOpenCreateRepeatSheet = () => {
    setIsCreateRepeatMode(true);
    handleClearSelectedRepeatTodo();
    handlePressOpenRepeatSheet();
  };

  const handleOpenEditRepeatSheet = (repeatTodo: RepeatTodoItemType) => {
    setIsCreateRepeatMode(false);
    handlePressRepeatTodo(repeatTodo);
    handlePressOpenRepeatSheet();
  };

  const handleSubmitRepeatTodo = (repeatTodo: RepeatTodoItemType) => {
    if (isCreateRepeatMode) {
      handleCreateRepeatTodo(repeatTodo);
      return;
    }

    if (selectedRepeatTodo?.id) {
      handleEditRepeatTodo(selectedRepeatTodo.id, repeatTodo);
    }
  };

  const handleCloseRepeatSheet = () => {
    closeSheet();
    handleClearSelectedRepeatTodo();
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

  useEffect(() => {
    onEditorViewModeChange?.(viewMode);
  }, [onEditorViewModeChange, viewMode]);

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!goalDetail || isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <SpoqaText className="text-size14 text-role-text-inverse dark:text-role-dark-text-inverse">
          {"목표 정보를 불러오지 못했습니다."}
        </SpoqaText>
      </View>
    );
  }

  return (
    <>
      {viewMode === "form" ? (
        <GoalEditFormView
          goalId={goalId}
          defaultTitle={goalDetail.name}
          pickedColor={pickedColor}
          privacyType={goalDetail.privacyType}
          priority={goalDetail.priority}
          repeatTodoCount={repeatTodos.length}
          redirectOnSuccess={redirectOnSuccess}
          invalidateFeedOnSuccess={invalidateFeedOnSuccess}
          onMutationSuccess={onMutationSuccess}
          onPressOpenColorSheet={handlePressOpenColorSheet}
          onPressOpenRepeatManagement={handleOpenRepeatList}
          onPressTerminateGoal={handleTerminateGoal}
          onPressDeleteGoal={handlePressDeleteGoal}
        />
      ) : (
        <RepeatTodoListView
          repeatTodos={repeatTodos}
          onPressBack={() => setViewMode("form")}
          onPressAdd={handleOpenCreateRepeatSheet}
          onPressRepeatTodo={handleOpenEditRepeatSheet}
          onPressDeleteRepeatTodo={handlePressDeleteRepeatTodo}
          isDeleteConfirmOpen={isDeleteConfirmOpen}
          onCompleteDeleteRepeatTodo={handleCompleteDeleteRepeatTodo}
          onCloseDeleteModal={handleCloseDeleteModal}
        />
      )}

      <ColorSheet
        isShow={isColorSheetOpen}
        pickedColor={pickedColor}
        onClick={handlePickColor}
        onClose={handleCloseColorSheet}
      />

      <RepeatTodosheet
        bottomSheetRef={ref}
        onClose={handleCloseRepeatSheet}
        onDismiss={handleClearSelectedRepeatTodo}
        repeatTodo={selectedRepeatTodo}
        sheetTitle={isCreateRepeatMode ? t("repeatTodo.create") : t("repeatTodo.edit")}
        submitLabel={isCreateRepeatMode ? t("repeatTodo.create") : t("repeatTodo.edit")}
        onSubmit={handleSubmitRepeatTodo}
      />

      <ConfirmModal
        isToggle={isGoalDeleteConfirmOpen}
        title={t("goal.deleteConfirmTitle")}
        message={t("common.cannotUndo")}
        completeText={t("common.delete")}
        incompleteText={t("common.cancel")}
        handleToggleOff={() => setIsGoalDeleteConfirmOpen(false)}
        onCompleteCheck={handleCompleteDeleteGoal}
      />
    </>
  );
}

export default GoalEditorScreen;
