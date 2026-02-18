import { useRef, useState } from "react";
import type { FlatList } from "react-native";
import { View } from "react-native";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";

import {
  AlarmSheet,
  AlertModal,
  BottomSingleCalendar,
  DDuDuSheet,
  DDuDuTimeSheet,
  EmptyList,
  GoalItem,
} from "@/components";
import { DDuDuEditorSheet, useDDuDuEditorSheet } from "@/features/ddudu";
import { useToggle } from "@/hooks";
import type { MainDDuDusType, MainDailyListType } from "@/types/response/feed/feed";
import { hexConvertForRGBA, remToPx } from "@/utils";

import { MainDDuDuItem } from "./components";
import {
  useDDuDuDate,
  useDDuDuDateMutation,
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
  const [currentDDuDuId, setCurrentDDuDuId] = useState(-1);
  const [hasAlarmBeginAt, setHasAlarmBeginAt] = useState(true);
  const listRef = useRef<FlatList<MainDailyListType>>(null);

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
      <Animated.View style={{ flex: 1 }}>
        <Animated.FlatList
          contentContainerStyle={{ marginTop: remToPx(0.8) }}
          ref={listRef}
          data={dailyList}
          keyExtractor={(item) => item.goal.id.toString()}
          style={{ flex: 1 }}
          itemLayoutAnimation={LinearTransition.duration(180)}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isCalendarOpen}
          bounces={!isCalendarOpen}
          alwaysBounceVertical={!isCalendarOpen}
          overScrollMode="always"
          ListEmptyComponent={() => <EmptyList text="목표를 먼저 생성해보세요." />}
          renderItem={({ item }) => {
            const groupBorderColor = hexConvertForRGBA({ hex: item.goal.color, alpha: 0.35 });
            const thinBorderColor = hexConvertForRGBA({ hex: item.goal.color, alpha: 0.28 });
            const emptyBackgroundColor = hexConvertForRGBA({ hex: item.goal.color, alpha: 0.12 });

            return (
              <Animated.View entering={FadeInDown.duration(180)}>
                <View
                  className="mb-4 overflow-hidden rounded-radius15 border-[0.16rem]"
                  style={{ borderColor: groupBorderColor }}
                >
                  <View
                    className="border-b-[0.16rem]"
                    style={{ borderBottomColor: groupBorderColor }}
                  >
                    <GoalItem
                      className="w-full"
                      type="create"
                      isRounded={false}
                      height={remToPx(1.8) + 15}
                      goal={item.goal}
                      onPress={() => handleOpenCreateSheet(item.goal)}
                    />
                  </View>

                  <View>
                    {item.ddudus.length === 0 && (
                      <View style={{ backgroundColor: emptyBackgroundColor }}>
                        <EmptyList
                          text="아직 생성된 뚜두가 없어요."
                          className="w-full items-center py-[2rem]"
                          textClassName="mt-[0.8rem] text-size14 text-black_300"
                          iconStroke="#8E8E93"
                        />
                      </View>
                    )}

                    {item.ddudus.map((dduduItem: MainDDuDusType, index: number) => {
                      const showThinBorder = index !== item.ddudus.length - 1;

                      return (
                        <Animated.View
                          key={dduduItem.id}
                          style={{
                            borderBottomWidth: showThinBorder ? 1 : 0,
                            borderBottomColor: thinBorderColor,
                          }}
                        >
                          <MainDDuDuItem
                            id={dduduItem.id}
                            ddudu={dduduItem.name}
                            status={dduduItem.status}
                            color={item.goal.color}
                            onDDuDuCompleteToggle={onDDuDuCompleteToggle}
                            handleToggleOn={() => handleDDuDuSheetOpen(dduduItem.id)}
                          />
                        </Animated.View>
                      );
                    })}
                  </View>
                </View>
              </Animated.View>
            );
          }}
        />
      </Animated.View>

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
