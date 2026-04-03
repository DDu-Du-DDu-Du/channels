import { useEffect, useMemo } from "react";
import { View } from "react-native";

import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import BottomSingleCalendar from "@/components/calendar/bottom-single-calendar/bottom-single-calendar";
import FormHeader from "@/components/form-header/form-header";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import type { TodoDetailType } from "@/components/todo-sheet/todo-sheet.types";
import TodoTimeSheet from "@/components/todo-time-sheet/todo-time-sheet";
import { FEED_KEY } from "@/constants/query-key/query-key";
import type { TodoTimeRangeType } from "@/features/feed/feed.types";
import { useBottomSheetAction, useToggle } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { getTodoDetail } from "@/service/feed/feed";
import { formatDateToYYYYMMDD, parseUtc } from "@/utils";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
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
    handleChangeTitle,
    handleChangeDate,
    handleToggleDetail,
    handleChangeTime,
    handleChangeBeginTimeEnabled,
    handleChangeEndTimeEnabled,
    handleAppendReminder,
    handleUpdateReminder,
    handleRemoveReminder,
    handleSetReminders,
    handleChangeMemo,
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

  const handleCreateReminder = async (remindsAt: string) => {
    handleAppendReminder({ remindsAt });
  };

  const handleUpdateReminderItem = async (
    index: number,
    reminder: { id?: number; remindsAt: string; remindedAt?: string | null },
    remindsAt: string,
  ) => {
    handleUpdateReminder(index, { ...reminder, remindsAt });
  };

  const handleDeleteReminderItem = async (
    index: number,
    _reminder: { id?: number; remindsAt: string; remindedAt?: string | null },
  ) => {
    handleRemoveReminder(index);
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
      if (state.reminders.length > 0) {
        handleSetReminders([]);
      }
      return;
    }

    const beginAt = `${beginHour.toString().padStart(2, "0")}:${beginMin
      .toString()
      .padStart(2, "0")}:00`;
    const endAt = isEndTimeEnabled
      ? `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}:00`
      : "";

    handleChangeTime(beginAt, endAt);

    const isBeginChanged = state.beginAt !== beginAt || !state.isBeginTimeEnabled;
    if (!isBeginChanged) {
      return;
    }

    const nextStartAt = new Date(`${state.scheduledOn}T${beginAt}`);
    if (Number.isNaN(nextStartAt.getTime())) {
      return;
    }

    const filteredReminders = state.reminders.filter((reminder) => {
      try {
        return parseUtc(reminder.remindsAt).getTime() < nextStartAt.getTime();
      } catch {
        return true;
      }
    });

    if (filteredReminders.length !== state.reminders.length) {
      handleSetReminders(filteredReminders);
    }
  };

  return (
    <>
      <BottomSheet
        ref={ref}
        onClose={onClose}
        fitContent={false}
        defaultHeight={state.detailOpen ? "90%" : "42%"}
        maxHeight="96%"
      >
        <View className="h-full min-h-0 w-full bg-role-surface-panel dark:bg-role-dark-surface-panel">
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
            <BottomSheetScrollView
              className="flex-1"
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
              showsVerticalScrollIndicator={false}
            >
              <TodoEditorForm
                mode={mode}
                state={state}
                titleWarning={titleWarning}
                isPending={isPending}
                onPressOpenCalendar={handleCalendarOpen}
                onPressOpenTimeSheet={handleTimeSheetOpen}
                onChangeTitle={handleChangeTitle}
                onToggleDetail={handleToggleDetail}
                onCreateReminder={handleCreateReminder}
                onUpdateReminder={handleUpdateReminderItem}
                onDeleteReminder={handleDeleteReminderItem}
                onChangeMemo={handleChangeMemo}
                onSubmit={handleSubmitEditor}
              />
            </BottomSheetScrollView>
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
          scheduledOn={state.scheduledOn}
          reminders={state.reminders}
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
