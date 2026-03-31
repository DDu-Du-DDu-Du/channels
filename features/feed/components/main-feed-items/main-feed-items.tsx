import { useState } from "react";
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
  useTodoReminderMutation,
  useTodoTime,
  useTodoTimeMutation,
} from "./hooks";

export interface MainFeedItemsProps {
  view: MainFeedView;
  dailyList: MainDailyListType[];
  dailyTimeTable?: MainDailyTimeTableType;
  isDailyTimeTableLoading?: boolean;
  selectedTodoDate: string;
  isCalendarOpen?: boolean;
}

function MainFeedItems({
  view,
  dailyList,
  dailyTimeTable,
  isDailyTimeTableLoading = false,
  selectedTodoDate,
  isCalendarOpen = true,
}: MainFeedItemsProps) {
  const [currentTodoId, setCurrentTodoId] = useState(-1);
  const [hasAlarmBeginAt, setHasAlarmBeginAt] = useState(true);

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

  const { currentTodoTime, handleTodoTimeSetting, handleUpdateTodoTime } = useTodoTime({
    handleTodoTimeSheetToggleOn,
    handleTodosheetToggleOff,
  });

  const { onTodoCompleteToggle, onDeleteTodo } = useTodoMutation({
    selectedTodoDate,
    handleTodosheetToggleOff,
  });

  const { onChangeTodoDate, onRepeatCurrentDate, onChangeCurrentDate } = useTodoDateMutation({
    currentTodoId,
    currentCalendarType,
    handleSelectedDate,
    handleCalendarSheetToggleOff,
    handleTodosheetToggleOff,
  });

  const { onChangeTodoTime } = useTodoTimeMutation({
    currentTodoTime,
    currentTodoId,
    selectedTodoDate,
    handleUpdateTodoTime,
    handleTodoTimeSheetToggleOff,
  });

  const { handleChangeTodoReminder } = useTodoReminderMutation({
    currentTodoId,
    selectedTodoDate,
  });

  const handleTodosheetOpen = (id: number) => {
    setCurrentTodoId(id);
    handleTodosheetToggleOn();
  };

  const handleAlarmSetting = (hasBeginAt: boolean) => {
    setHasAlarmBeginAt(hasBeginAt);
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
          title="알림"
          message="종료된 목표에는 투두를 추가할 수 없어요."
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
          onClose={handleAlarmSheetToggleOff}
          onConfirm={handleChangeTodoReminder}
          hasBeginTime={hasAlarmBeginAt}
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
        />
      )}
    </View>
  );
}

export default MainFeedItems;
