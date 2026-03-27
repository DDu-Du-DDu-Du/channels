import { useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";

import {
  BottomSheet,
  BottomSingleCalendar,
  FormHeader,
  SpoqaText,
  TodoTimeSheet,
} from "@/components";
import { useToast } from "@/components/toast/hooks";
import type { TodoDetailType } from "@/components/todo-sheet/todo-sheet.types";
import { FEED_KEY } from "@/constants/query-key/query-key";
import type { TodoTimeRangeType } from "@/features/feed/feed.types";
import { useBottomSheetAction, useToggle } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { getTodoDetail } from "@/service/feed/feed";
import { formatDateToYYYYMMDD } from "@/utils";
import { useQuery } from "@tanstack/react-query";

import { useTodoEditorMutation, useTodoEditorState } from "../../hooks";
import TodoEditorForm from "../todo-editor-form/todo-editor-form";

export interface TodoEditorSheetProps {
  mode: "create" | "edit";
  goalId?: number;
  TodoId?: number;
  selectedDate: string;
  onClose: () => void;
  onSuccess?: () => void;
}

function TodoEditorSheet({
  mode,
  goalId,
  TodoId,
  selectedDate,
  onClose,
  onSuccess,
}: TodoEditorSheetProps) {
  const iconStroke = useThemeColorToken("ui.icon.default");
  const { ref, openSheet, closeSheet } = useBottomSheetAction();
  const { createToast } = useToast();

  const {
    isToggle: isCalendarOpen,
    handleToggleOn: handleCalendarOpen,
    handleToggleOff: handleCalendarClose,
  } = useToggle();

  const {
    isToggle: isTimeSheetOpen,
    handleToggleOn: handleTimeSheetOpen,
    handleToggleOff: handleTimeSheetClose,
  } = useToggle();

  const { data: TodoDetail, isLoading } = useQuery<TodoDetailType>({
    queryKey: [FEED_KEY.Todo_DETAIL, TodoId],
    queryFn: () => getTodoDetail({ id: TodoId ?? -1 }),
    enabled: mode === "edit" && Boolean(TodoId),
  });

  const {
    state,
    titleWarning,
    reminderWarning,
    handleChangeTitle,
    handleChangeDate,
    handleToggleDetail,
    handleChangeTime,
    handleChangeBeginTimeEnabled,
    handleChangeEndTimeEnabled,
    handleToggleReminder,
    handleChangeReminderValue,
    handleChangeMemo,
    handleSetReminderWarning,
    getSubmitPayload,
  } = useTodoEditorState({
    mode,
    selectedDate,
    TodoDetail,
  });

  const { isPending, handleSubmit } = useTodoEditorMutation({
    mode,
    goalId: goalId ?? TodoDetail?.goalId,
    TodoId,
    selectedTodoDate: selectedDate,
    onSuccess: () => {
      closeSheet();
      onSuccess?.();
      onClose();
    },
  });

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  const currentTodoTime = useMemo(
    () => ({
      beginAt: state.beginAt || null,
      endAt: state.endAt || null,
    }),
    [state.beginAt, state.endAt],
  );

  const handleClose = () => {
    closeSheet();
    onClose();
  };

  const handleSubmitEditor = async () => {
    const payload = getSubmitPayload();
    if (!payload) {
      return;
    }

    await handleSubmit(payload);
  };

  const handleToggleReminderWithValidation = (enabled: boolean) => {
    if (enabled && (!state.isBeginTimeEnabled || !state.beginAt)) {
      const warning = "시작시간이 필요해요";
      handleSetReminderWarning(warning);
      createToast(warning, { type: "warning" });
      return;
    }

    handleSetReminderWarning("");
    handleToggleReminder(enabled);
  };

  const handleUpdateTodoTime = ({
    beginHour,
    beginMin,
    endHour,
    endMin,
    isBeginTimeEnabled,
    isEndTimeEnabled,
  }: TodoTimeRangeType) => {
    if (!isBeginTimeEnabled) {
      handleChangeTime("", "");
      return;
    }

    const beginAt = `${beginHour.toString().padStart(2, "0")}:${beginMin
      .toString()
      .padStart(2, "0")}:00`;
    const endAt = isEndTimeEnabled
      ? `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}:00`
      : "";

    handleChangeTime(beginAt, endAt);
  };

  return (
    <>
      <BottomSheet
        ref={ref}
        onClose={onClose}
        fitContent={!state.detailOpen}
        defaultHeight={state.detailOpen ? "90%" : "35%"}
        maxHeight="90%"
      >
        <View className="w-full bg-role-surface-panel dark:bg-role-dark-surface-panel">
          <FormHeader
            title={mode === "create" ? "투두 생성" : "투두 수정"}
            onPressBack={handleClose}
            titleClassName="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
            iconStroke={iconStroke}
            className="px-[2.4rem] pb-[1.2rem] pt-[1.6rem]"
          />

          {isLoading ? (
            <View className="px-[2.4rem] pb-[2.4rem]">
              <SpoqaText className="text-size14 text-role-text-secondary dark:text-role-dark-text-secondary">
                불러오는 중...
              </SpoqaText>
            </View>
          ) : (
            <ScrollView
              className="max-h-[68rem]"
              contentContainerStyle={{ paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
            >
              <TodoEditorForm
                mode={mode}
                state={state}
                titleWarning={titleWarning}
                reminderWarning={reminderWarning}
                isPending={isPending}
                onPressOpenCalendar={handleCalendarOpen}
                onPressOpenTimeSheet={handleTimeSheetOpen}
                onChangeTitle={handleChangeTitle}
                onToggleDetail={handleToggleDetail}
                onToggleReminder={handleToggleReminderWithValidation}
                onChangeReminderDay={(value) => handleChangeReminderValue("day", value)}
                onChangeReminderHour={(value) => handleChangeReminderValue("hour", value)}
                onChangeReminderMinute={(value) => handleChangeReminderValue("minute", value)}
                onChangeMemo={handleChangeMemo}
                onSubmit={handleSubmitEditor}
              />
            </ScrollView>
          )}
        </View>
      </BottomSheet>

      {isCalendarOpen && (
        <BottomSingleCalendar
          currentDate={state.scheduledOn}
          selectedDate={new Date(state.scheduledOn)}
          setSelected={(nextDate) => {
            if (!nextDate) {
              return;
            }

            handleChangeDate(formatDateToYYYYMMDD(nextDate));
          }}
          onChangeTodoDate={(nextDate) => {
            handleChangeDate(formatDateToYYYYMMDD(nextDate));
            handleCalendarClose();
          }}
          handleCalendarSheetToggleOff={handleCalendarClose}
        />
      )}

      {isTimeSheetOpen && (
        <TodoTimeSheet
          currentTodoTime={currentTodoTime}
          onChangeTodoTime={handleUpdateTodoTime}
          onClose={handleTimeSheetClose}
          title="시간 설정"
          showBackArrow
          defaultBeginTimeEnabled={state.isBeginTimeEnabled}
          defaultEndTimeEnabled={state.isEndTimeEnabled}
          onChangeBeginTimeEnabled={handleChangeBeginTimeEnabled}
          onChangeEndTimeEnabled={handleChangeEndTimeEnabled}
        />
      )}
    </>
  );
}

export default TodoEditorSheet;
