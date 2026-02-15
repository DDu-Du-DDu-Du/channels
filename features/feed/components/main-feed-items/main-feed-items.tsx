import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FlatList } from "react-native";
import { View } from "react-native";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";

import {
  AlarmSheet,
  AlertModal,
  BottomSingleCalendar,
  DDuDuSheet,
  DDuDuTimeSheet,
  GoalItem,
} from "@/components";
import { useToggle } from "@/hooks";
import type { MainDDuDusType, MainDailyListType } from "@/types/response/feed/feed";
import { remToPx } from "@/utils";

import { MainDDuDuInput, MainDDuDuItem } from "./components";
import {
  useDDuDuDate,
  useDDuDuDateMutation,
  useDDuDuEdit,
  useDDuDuMutation,
  useDDuDuTime,
  useDDuDuTimeMutation,
} from "./hooks";

export interface MainFeedItemsProps {
  dailyList: MainDailyListType[];
  selectedDDuDuDate: string;
  isCalendarOpen?: boolean;
}

function MainFeedItems({
  dailyList,
  selectedDDuDuDate,
  isCalendarOpen = true,
}: MainFeedItemsProps) {
  const [createGoalId, setCreateGoalId] = useState<number | null>(null);
  const listRef = useRef<FlatList<MainDailyListType>>(null);

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

  const handleSetCreateGoalId: Dispatch<SetStateAction<boolean>> = (value) => {
    if (typeof value === "function") {
      const nextValue = value(false);
      if (!nextValue) {
        setCreateGoalId(null);
      }
      return;
    }

    if (!value) {
      setCreateGoalId(null);
    }
  };

  const {
    currentDDuDuId,
    editDDuDuId,
    setCurrentDDuDuId,
    handleCloseDDuDuInput,
    handleUpdateEditDDuDuId,
  } = useDDuDuEdit({ setIsCreateDDuDu: handleSetCreateGoalId });

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

  const { onChangeDDuDuDate, onRepeatCurrentDate } = useDDuDuDateMutation({
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

  useEffect(() => {
    setCreateGoalId(null);
  }, [dailyList]);

  const dduduItemHeight = useMemo(() => remToPx(3.2), []);
  const dduduItemSpacing = useMemo(() => remToPx(1), []);

  useEffect(() => {
    if (!createGoalId) {
      return;
    }

    const targetIndex = dailyList.findIndex((goalGroup) => goalGroup.goal.id === createGoalId);
    if (targetIndex === -1) {
      return;
    }

    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        index: targetIndex,
        animated: true,
        viewPosition: 1,
      });
    });
  }, [createGoalId, dailyList]);
  const handleDDuDuSheetOpen = (id: number) => {
    setCurrentDDuDuId(id);
    handleDDuDuSheetToggleOn();
  };

  const handleAlarmSetting = () => {
    handleAlarmSheetToggleOn();
    handleDDuDuSheetToggleOff();
  };

  const handleOpenDDuDuInput = (goal: MainDailyListType["goal"]) => {
    if (goal.status === "DONE") {
      handleAlertModalToggleOn();
      return;
    }

    setCreateGoalId(goal.id);
  };

  const handleCloseInput = () => {
    handleCloseDDuDuInput();
    setCreateGoalId(null);
  };

  return (
    <View className="mt-[0.8rem] px-4 flex-1">
      <Animated.View style={{ flex: 1 }}>
        <Animated.FlatList
          contentContainerStyle={{ marginTop: remToPx(0.8) }}
          ref={listRef}
          data={dailyList}
          keyExtractor={(item) => item.goal.id.toString()}
          style={{ flex: 1, borderTopWidth: 1, borderTopColor: "rgba(255, 255, 255, 0.16)" }}
          itemLayoutAnimation={LinearTransition.duration(180)}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isCalendarOpen}
          bounces={!isCalendarOpen}
          alwaysBounceVertical={!isCalendarOpen}
          overScrollMode="always"
          renderItem={({ item }) => (
            <Animated.View entering={FadeInDown.duration(180)}>
              <View
                className="border rounded-radius10 p-3 mb-4"
                style={{ borderColor: `#${item.goal.color}` }}
              >
                <GoalItem
                  className="p-[1rem]"
                  type="create"
                  height={remToPx(1.8) + 15}
                  goal={item.goal}
                  onPress={() => handleOpenDDuDuInput(item.goal)}
                />
                <View
                  className="mx-[1rem] mb-[1rem]"
                  style={{ borderBottomWidth: 1, borderBottomColor: "rgba(255, 255, 255, 0.14)" }}
                />

                {item.ddudus.map((dduduItem: MainDDuDusType) => (
                  <Animated.View
                    key={dduduItem.id}
                    style={{ height: dduduItemHeight, marginBottom: dduduItemSpacing }}
                  >
                    {dduduItem.id === editDDuDuId ? (
                      <MainDDuDuInput
                        type="edit"
                        goalId={item.goal.id}
                        color={item.goal.color}
                        dduduItem={dduduItem}
                        selectedDDuDuDate={selectedDDuDuDate}
                        onCloseDDuDuInput={handleCloseInput}
                      />
                    ) : (
                      <MainDDuDuItem
                        id={dduduItem.id}
                        ddudu={dduduItem.name}
                        status={dduduItem.status}
                        color={item.goal.color}
                        onDDuDuCompleteToggle={onDDuDuCompleteToggle}
                        onTextPress={handleUpdateEditDDuDuId}
                        handleToggleOn={() => handleDDuDuSheetOpen(dduduItem.id)}
                      />
                    )}
                  </Animated.View>
                ))}

                {createGoalId === item.goal.id && (
                  <MainDDuDuInput
                    goalId={item.goal.id}
                    color={item.goal.color}
                    selectedDDuDuDate={selectedDDuDuDate}
                    onCloseDDuDuInput={handleCloseInput}
                  />
                )}
              </View>
            </Animated.View>
          )}
        />
      </Animated.View>

      {isAlertModalToggle && (
        <AlertModal
          isToggle={isAlertModalToggle}
          handleToggleOff={handleAlertModalToggleOff}
          title="Alert"
          message="This goal is already completed."
        />
      )}

      {isDDuDuSheetToggle && (
        <DDuDuSheet
          dduduId={currentDDuDuId}
          handleEditDDuDu={handleUpdateEditDDuDuId}
          onDeleteDDuDu={onDeleteDDuDu}
          handleDDuDuSheetToggleOff={handleDDuDuSheetToggleOff}
          handleSelectDifferentDate={handleSelectDifferentDate}
          handleAlarmSetting={handleAlarmSetting}
          handleDDuDuTimeSetting={handleDDuDuTimeSetting}
          onRepeatCurrentDate={onRepeatCurrentDate}
        />
      )}
      {isAlarmSheetToggle && <AlarmSheet onClose={handleAlarmSheetToggleOff} />}
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
