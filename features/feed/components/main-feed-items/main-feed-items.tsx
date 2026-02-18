import { useState } from "react";
import { View } from "react-native";

import {
  AlarmSheet,
  AlertModal,
  BottomSingleCalendar,
  DDuDuSheet,
  DDuDuTimeSheet,
} from "@/components";
import { DDuDuEditorSheet, useDDuDuEditorSheet } from "@/features/ddudu";
import type { MainFeedView } from "@/features/feed/components/main-feed/main-feed";
import { useToggle } from "@/hooks";
import type { MainDailyListType, MainDailyTimeTableType } from "@/types/response/feed/feed";

import { MainFeedListItems, MainFeedTimelineItems } from "./components";
import {
  useDDuDuDate,
  useDDuDuDateMutation,
  useDDuDuMutation,
  useDDuDuTime,
  useDDuDuTimeMutation,
} from "./hooks";

export interface MainFeedItemsProps {
  view: MainFeedView;
  dailyList: MainDailyListType[];
  dailyTimeTable?: MainDailyTimeTableType;
  isDailyTimeTableLoading?: boolean;
  selectedDDuDuDate: string;
  isCalendarOpen?: boolean;
}

function MainFeedItems({
  view,
  dailyList,
  dailyTimeTable,
  isDailyTimeTableLoading = false,
  selectedDDuDuDate,
  isCalendarOpen = true,
}: MainFeedItemsProps) {
  const [currentDDuDuId, setCurrentDDuDuId] = useState(-1);
  const [hasAlarmBeginAt, setHasAlarmBeginAt] = useState(true);

  const { editorSheetState, handleOpenCreateEditor, handleOpenEditEditor, handleCloseEditor } =
    useDDuDuEditorSheet();

  const {
    isToggle: isDDuDuSheetToggle,
    handleToggleOn: handleDDuDuSheetToggleOn,
    handleToggleOff: handleDDuDuSheetToggleOff,
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
    isToggle: isDDuDuTimeSheetToggle,
    handleToggleOn: handleDDuDuTimeSheetToggleOn,
    handleToggleOff: handleDDuDuTimeSheetToggleOff,
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
  } = useDDuDuDate({ handleCalendarSheetToggleOn, handleDDuDuSheetToggleOff });

  const { currentDDuDuTime, handleDDuDuTimeSetting, handleUpdateDDuDuTime } = useDDuDuTime({
    handleDDuDuTimeSheetToggleOn,
    handleDDuDuSheetToggleOff,
  });

  const { onDDuDuCompleteToggle, onDeleteDDuDu } = useDDuDuMutation({
    selectedDDuDuDate,
    handleDDuDuSheetToggleOff,
  });

  const { onChangeDDuDuDate, onRepeatCurrentDate, onChangeCurrentDate } = useDDuDuDateMutation({
    currentDDuDuId,
    currentCalendarType,
    handleSelectedDate,
    handleCalendarSheetToggleOff,
    handleDDuDuSheetToggleOff,
  });

  const { onChangeDDuDuTime } = useDDuDuTimeMutation({
    currentDDuDuTime,
    currentDDuDuId,
    selectedDDuDuDate,
    handleUpdateDDuDuTime,
    handleDDuDuTimeSheetToggleOff,
  });

  const handleDDuDuSheetOpen = (id: number) => {
    setCurrentDDuDuId(id);
    handleDDuDuSheetToggleOn();
  };

  const handleAlarmSetting = (hasBeginAt: boolean) => {
    setHasAlarmBeginAt(hasBeginAt);
    handleAlarmSheetToggleOn();
    handleDDuDuSheetToggleOff();
  };

  const handleOpenCreateSheet = (goal: MainDailyListType["goal"]) => {
    if (goal.status === "DONE") {
      handleAlertModalToggleOn();
      return;
    }

    handleOpenCreateEditor(goal.id);
  };

  const handleEditDDuDu = (id: number) => {
    handleDDuDuSheetToggleOff();
    handleOpenEditEditor(id);
  };

  return (
    <View className="mt-[0.8rem] flex-1 px-4">
      {view === "timeline" ? (
        <MainFeedTimelineItems
          dailyTimeTable={dailyTimeTable}
          isDailyTimeTableLoading={isDailyTimeTableLoading}
          isCalendarOpen={isCalendarOpen}
          onDDuDuCompleteToggle={onDDuDuCompleteToggle}
          onDDuDuSheetOpen={handleDDuDuSheetOpen}
        />
      ) : (
        <MainFeedListItems
          dailyList={dailyList}
          isCalendarOpen={isCalendarOpen}
          onDDuDuCompleteToggle={onDDuDuCompleteToggle}
          onDDuDuSheetOpen={handleDDuDuSheetOpen}
          onOpenCreateSheet={handleOpenCreateSheet}
        />
      )}

      {isAlertModalToggle && (
        <AlertModal
          isToggle={isAlertModalToggle}
          handleToggleOff={handleAlertModalToggleOff}
          title="알림"
          message="종료된 목표에는 뚜두를 추가할 수 없어요."
        />
      )}

      {isDDuDuSheetToggle && (
        <DDuDuSheet
          dduduId={currentDDuDuId}
          handleEditDDuDu={handleEditDDuDu}
          onDeleteDDuDu={onDeleteDDuDu}
          handleDDuDuSheetToggleOff={handleDDuDuSheetToggleOff}
          handleSelectDifferentDate={handleSelectDifferentDate}
          handleAlarmSetting={handleAlarmSetting}
          handleDDuDuTimeSetting={handleDDuDuTimeSetting}
          onRepeatCurrentDate={onRepeatCurrentDate}
          onChangeCurrentDate={onChangeCurrentDate}
        />
      )}

      {editorSheetState.isOpen && (
        <DDuDuEditorSheet
          mode={editorSheetState.mode}
          goalId={editorSheetState.goalId}
          dduduId={editorSheetState.dduduId}
          selectedDate={selectedDDuDuDate}
          onClose={handleCloseEditor}
        />
      )}

      {isAlarmSheetToggle && (
        <AlarmSheet
          onClose={handleAlarmSheetToggleOff}
          hasBeginTime={hasAlarmBeginAt}
        />
      )}

      {isCalendarSheetToggle && (
        <BottomSingleCalendar
          currentDate={currentDate}
          selectedDate={selectedDate}
          setSelected={handleSelectedDate}
          onChangeDDuDuDate={onChangeDDuDuDate}
          handleCalendarSheetToggleOff={handleCalendarSheetToggleOff}
        />
      )}

      {isDDuDuTimeSheetToggle && (
        <DDuDuTimeSheet
          currentDDuDuTime={currentDDuDuTime}
          onChangeDDuDuTime={onChangeDDuDuTime}
          onClose={handleDDuDuTimeSheetToggleOff}
        />
      )}
    </View>
  );
}

export default MainFeedItems;
