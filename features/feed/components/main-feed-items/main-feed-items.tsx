import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import {
  AlarmSheet,
  AlertModal,
  BottomSingleCalendar,
  TodoTimeSheet,
  Todosheet,
} from "@/components";
import type { MainFeedView } from "@/features/feed/components/main-feed/main-feed";
import { TodoEditorSheet, useTodoEditorSheet } from "@/features/todo";
import { useToggle } from "@/hooks";
import type { MainDailyListType, MainDailyTimeTableType } from "@/types/response/feed/feed";

import { MainFeedListItems, MainFeedTimelineItems } from "./components";
import {
  useTodoDate,
  useTodoDateMutation,
  useTodoMutation,
  useTodoTime,
  useTodoTimeMutation,
} from "./hooks";

export interface MainFeedItemsProps {
  view: MainFeedView;
  dailyList: MainDailyListType[];
  isDailyListLoading?: boolean;
  dailyTimeTable?: MainDailyTimeTableType;
  isDailyTimeTableLoading?: boolean;
  selectedTodoDate: string;
  isCalendarOpen?: boolean;
}

function MainFeedItems({
  view,
  dailyList,
  isDailyListLoading = false,
  dailyTimeTable,
  isDailyTimeTableLoading = false,
  selectedTodoDate,
  isCalendarOpen = true,
}: MainFeedItemsProps) {
  const { t } = useTranslation();
  const [currentTodoId, setCurrentTodoId] = useState(-1);

  const { editorSheetState, handleOpenCreateEditor, handleOpenEditEditor, handleCloseEditor } =
    useTodoEditorSheet();

  const {
    isToggle: isTodosheetToggle,
    handleToggleOn: handleTodosheetToggleOn,
    handleToggleOff: handleTodosheetToggleOff,
  } = useToggle();

  const {
    isToggle: isAlarmSheetToggle,
    handleToggleOn: handleAlarmSheetToggleOn,
    handleToggleOff: handleAlarmSheetToggleOff,
  } = useToggle();

  const {
    isToggle: isCalendarSheetToggle,
    handleToggleOn: handleCalendarSheetToggleOn,
    handleToggleOff: handleCalendarSheetToggleOff,
  } = useToggle();

  const {
    isToggle: isTodoTimeSheetToggle,
    handleToggleOn: handleTodoTimeSheetToggleOn,
    handleToggleOff: handleTodoTimeSheetToggleOff,
  } = useToggle();

  const {
    isToggle: isAlertModalToggle,
    handleToggleOn: handleAlertModalToggleOn,
    handleToggleOff: handleAlertModalToggleOff,
  } = useToggle();

  const {
    selectedDate,
    currentDate,
    currentCalendarType,
    handleSelectedDate,
    handleSelectDifferentDate,
  } = useTodoDate({ handleCalendarSheetToggleOn, handleTodosheetToggleOff });

  const { currentTodoTime, currentTodoSchedule, handleTodoTimeSetting, handleUpdateTodoTime } =
    useTodoTime({
      handleTodoTimeSheetToggleOn,
      handleTodosheetToggleOff,
    });

  const { onTodoCompleteToggle, onDeleteTodo, isDeletePending, isCompleteTogglePending } =
    useTodoMutation({
      selectedTodoDate,
      handleTodosheetToggleOff,
    });

  const {
    onChangeTodoDate,
    onRepeatCurrentDate,
    onChangeCurrentDate,
    isChangeDatePending,
    isRepeatDatePending,
  } = useTodoDateMutation({
    currentTodoId,
    currentCalendarType,
    handleSelectedDate,
    handleCalendarSheetToggleOff,
    handleTodosheetToggleOff,
  });

  const { onChangeTodoTime, isChangeTimePending } = useTodoTimeMutation({
    currentTodoTime,
    currentTodoId,
    selectedTodoDate,
    handleUpdateTodoTime,
    handleTodoTimeSheetToggleOff,
  });

  const handleTodosheetOpen = (id: number) => {
    setCurrentTodoId(id);
    handleTodosheetToggleOn();
  };

  const handleAlarmSetting = () => {
    handleAlarmSheetToggleOn();
    handleTodosheetToggleOff();
  };

  const handleOpenCreateSheet = (goal: MainDailyListType["goal"]) => {
    if (goal.status === "DONE") {
      handleAlertModalToggleOn();
      return;
    }

    handleOpenCreateEditor(goal.id);
  };

  const handleEditTodo = (id: number) => {
    handleTodosheetToggleOff();
    handleOpenEditEditor(id);
  };

  return (
    <View className="mt-[0.8rem] flex-1 px-4">
      {view === "timeline" ? (
        <MainFeedTimelineItems
          dailyTimeTable={dailyTimeTable}
          isDailyTimeTableLoading={isDailyTimeTableLoading}
          isCalendarOpen={isCalendarOpen}
          onTodoCompleteToggle={onTodoCompleteToggle}
          onTodosheetOpen={handleTodosheetOpen}
        />
      ) : (
        <MainFeedListItems
          dailyList={dailyList}
          isDailyListLoading={isDailyListLoading}
          isCalendarOpen={isCalendarOpen}
          onTodoCompleteToggle={onTodoCompleteToggle}
          onTodosheetOpen={handleTodosheetOpen}
          onOpenCreateSheet={handleOpenCreateSheet}
        />
      )}

      {isAlertModalToggle && (
        <AlertModal
          isToggle={isAlertModalToggle}
          handleToggleOff={handleAlertModalToggleOff}
          title={t("navigation.notification")}
          message={t("feed.endedGoalCannotAddTodo")}
        />
      )}

      {isTodosheetToggle && (
        <Todosheet
          TodoId={currentTodoId}
          handleEditTodo={handleEditTodo}
          onDeleteTodo={onDeleteTodo}
          handleTodosheetToggleOff={handleTodosheetToggleOff}
          handleSelectDifferentDate={handleSelectDifferentDate}
          handleAlarmSetting={handleAlarmSetting}
          handleTodoTimeSetting={handleTodoTimeSetting}
          onRepeatCurrentDate={onRepeatCurrentDate}
          onChangeCurrentDate={onChangeCurrentDate}
          isDeletePending={isDeletePending}
          isChangeDatePending={isChangeDatePending}
          isRepeatDatePending={isRepeatDatePending}
          isChangeTimePending={isChangeTimePending}
          isCompleteTogglePending={isCompleteTogglePending}
        />
      )}

      {editorSheetState.isOpen && (
        <TodoEditorSheet
          mode={editorSheetState.mode}
          goalId={editorSheetState.goalId}
          TodoId={editorSheetState.TodoId}
          selectedDate={selectedTodoDate}
          onClose={handleCloseEditor}
        />
      )}

      {isAlarmSheetToggle && (
        <AlarmSheet
          todoId={currentTodoId}
          onClose={handleAlarmSheetToggleOff}
        />
      )}

      {isCalendarSheetToggle && (
        <BottomSingleCalendar
          currentDate={currentDate}
          selectedDate={selectedDate}
          setSelected={handleSelectedDate}
          onChangeTodoDate={onChangeTodoDate}
          handleCalendarSheetToggleOff={handleCalendarSheetToggleOff}
        />
      )}

      {isTodoTimeSheetToggle && (
        <TodoTimeSheet
          currentTodoTime={currentTodoTime}
          onChangeTodoTime={onChangeTodoTime}
          onClose={handleTodoTimeSheetToggleOff}
          scheduledOn={currentTodoSchedule.scheduledOn}
          reminders={currentTodoSchedule.reminders}
        />
      )}
    </View>
  );
}

export default MainFeedItems;
