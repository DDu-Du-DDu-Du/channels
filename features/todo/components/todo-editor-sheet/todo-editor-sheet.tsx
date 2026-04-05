import { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";

import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import BottomSingleCalendar from "@/components/calendar/bottom-single-calendar/bottom-single-calendar";
import FormHeader from "@/components/form-header/form-header";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import type { TodoDetailType } from "@/components/todo-sheet/todo-sheet.types";
import { FEED_KEY, GOAL_KEY } from "@/constants/query-key/query-key";
import { useMe } from "@/features/user";
import { useBottomSheetAction, useToggle } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { getTodoDetail } from "@/service/feed/feed";
import { getGoalList } from "@/service/goal/goal";
import { useAuthStore } from "@/stores";
import type { GoalType } from "@/types/response/goal/goal";
import { formatDateToYYYYMMDD } from "@/utils";
import { useQuery } from "@tanstack/react-query";

import { useTodoEditorMutation } from "../../hooks";
import TodoEditorForm from "../todo-editor-form/todo-editor-form";
import TodoGoalSelectSheet from "../todo-goal-select-sheet/todo-goal-select-sheet";

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
  const closeReasonRef = useRef<"final-close" | "navigate-to-child-sheet">("final-close");
  const iconStroke = useThemeColorToken("ui.icon.default");
  const { ref, openSheet, closeSheet } = useBottomSheetAction();
  const hasTokens = useAuthStore((state) => Boolean(state.accessToken && state.refreshToken));
  const isGuestSession = useAuthStore((state) => state.sessionType === "guest");

  const [selectedDateFromSheet, setSelectedDateFromSheet] = useState<string>();
  const [selectedGoalIdFromSheet, setSelectedGoalIdFromSheet] = useState<number>();
  const [calendarCurrentDate, setCalendarCurrentDate] = useState(selectedDate);
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | undefined>(
    new Date(selectedDate),
  );

  const {
    isToggle: isCalendarOpen,
    handleToggleOn: handleCalendarOpen,
    handleToggleOff: handleCalendarClose,
  } = useToggle();
  const {
    isToggle: isGoalSheetOpen,
    handleToggleOn: handleGoalSheetOpen,
    handleToggleOff: handleGoalSheetClose,
  } = useToggle();

  const { data: TodoDetail, isLoading } = useQuery<TodoDetailType>({
    queryKey: [FEED_KEY.Todo_DETAIL, TodoId],
    queryFn: () => getTodoDetail({ id: TodoId ?? -1 }),
    enabled: mode === "edit" && Boolean(TodoId),
  });

  useEffect(() => {
    const nextDate = TodoDetail?.scheduledOn ?? selectedDate;
    setCalendarCurrentDate(nextDate);
    setCalendarSelectedDate(new Date(nextDate));
    setSelectedDateFromSheet(nextDate);
    setSelectedGoalIdFromSheet(undefined);
  }, [TodoDetail?.goalId, TodoDetail?.scheduledOn, mode, selectedDate]);

  const { data: user } = useMe({ readOnly: true });
  const isSessionReady = isGuestSession || (!!hasTokens && !!user);

  const { data: goalList = [] } = useQuery<GoalType[]>({
    queryKey: [GOAL_KEY.GOAL_LIST, user?.id],
    queryFn: () => {
      if (!isGuestSession && !user?.id) {
        return Promise.resolve([]);
      }

      return getGoalList({ userId: user?.id ?? 0 });
    },
    enabled: !!isSessionReady,
  });

  const { isPending, handleSubmit } = useTodoEditorMutation({
    mode,
    TodoId,
    selectedTodoDate: selectedDate,
    onSuccess: () => {
      closeReasonRef.current = "final-close";
      closeSheet();
      onSuccess?.();
    },
  });

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  const handleClose = () => {
    closeReasonRef.current = "final-close";
    closeSheet();
  };

  const handleSheetDismiss = () => {
    if (closeReasonRef.current === "navigate-to-child-sheet") {
      closeReasonRef.current = "final-close";
      return;
    }

    onClose();
  };

  const handleRequestOpenCalendar = () => {
    closeReasonRef.current = "navigate-to-child-sheet";
    handleCalendarOpen();
  };

  const handleRequestOpenGoalSheet = () => {
    closeReasonRef.current = "navigate-to-child-sheet";
    handleGoalSheetOpen();
  };

  const handleCloseCalendarSheet = () => {
    handleCalendarClose();
    closeReasonRef.current = "final-close";
    openSheet();
  };

  const handleCloseGoalSheet = () => {
    handleGoalSheetClose();
    closeReasonRef.current = "final-close";
    openSheet();
  };

  const selectedDateForCalendar = useMemo(
    () => calendarSelectedDate ?? new Date(calendarCurrentDate),
    [calendarCurrentDate, calendarSelectedDate],
  );

  return (
    <>
      <BottomSheet
        ref={ref}
        onClose={handleSheetDismiss}
        fitContent={false}
        enableScroll
        defaultHeight="90%"
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
            <TodoEditorForm
              mode={mode}
              isGuestSession={isGuestSession}
              isPending={isPending}
              goalList={goalList}
              selectedDate={selectedDate}
              TodoDetail={TodoDetail}
              initialGoalId={goalId}
              selectedDateFromSheet={selectedDateFromSheet}
              selectedGoalIdFromSheet={selectedGoalIdFromSheet}
              onRequestOpenCalendar={handleRequestOpenCalendar}
              onRequestOpenGoalSheet={handleRequestOpenGoalSheet}
              onSubmitPayload={handleSubmit}
            />
          )}
        </View>
      </BottomSheet>

      {isCalendarOpen && (
        <BottomSingleCalendar
          currentDate={calendarCurrentDate}
          selectedDate={selectedDateForCalendar}
          setSelected={setCalendarSelectedDate}
          onChangeTodoDate={(nextDate) => {
            const nextDateString = formatDateToYYYYMMDD(nextDate);
            setCalendarCurrentDate(nextDateString);
            setSelectedDateFromSheet(nextDateString);
            handleCloseCalendarSheet();
          }}
          handleCalendarSheetToggleOff={handleCloseCalendarSheet}
        />
      )}

      {isGoalSheetOpen && (
        <TodoGoalSelectSheet
          onClose={handleCloseGoalSheet}
          onSelectGoal={(goal) => {
            setSelectedGoalIdFromSheet(goal.id);
          }}
        />
      )}
    </>
  );
}

export default TodoEditorSheet;
