import { useEffect, useState } from "react";
import { Pressable, Switch, View } from "react-native";

import { BottomSheet, SpoqaText } from "@/components";
import { DDuDuTimeRangeType, DDuDuTimeType } from "@/features/feed/feed.types";
import { useBottomSheetAction } from "@/hooks";
import { ArrowLeftIcon } from "@/icons";

import TimePicker from "../time-picker/time-picker";
import { DDUDU_TIME_SHEET } from "./ddudu-time-sheet.constant";
import { useTimeUpdate } from "./hooks";

export interface DDuDuTimeSheetProps {
  currentDDuDuTime: DDuDuTimeType;
  onChangeDDuDuTime: (selectedTime: DDuDuTimeRangeType) => void;
  onClose: () => void;
  title?: string;
  showBackArrow?: boolean;
  onPressBack?: () => void;
  confirmLabel?: string;
  defaultBeginTimeEnabled?: boolean;
  defaultEndTimeEnabled?: boolean;
  onChangeBeginTimeEnabled?: (enabled: boolean) => void;
  onChangeEndTimeEnabled?: (enabled: boolean) => void;
}

function DDuDuTimeSheet({
  currentDDuDuTime,
  onChangeDDuDuTime,
  onClose,
  title = "\uB69C\uB450\uC2DC\uAC04 \uC124\uC815",
  showBackArrow = false,
  onPressBack,
  confirmLabel = "\uD655\uC778",
  defaultBeginTimeEnabled = true,
  defaultEndTimeEnabled = true,
  onChangeBeginTimeEnabled,
  onChangeEndTimeEnabled,
}: DDuDuTimeSheetProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();
  const {
    beginHour,
    beginMin,
    endHour,
    endMin,
    isErrorMessage,
    handleDDuDuTimeChange,
    handleChangeBeginHour,
    handleChangeBeginMin,
    handleChangeEndHour,
    handleChangeEndMin,
    handleClearErrorMessage,
  } = useTimeUpdate({ currentDDuDuTime, onChangeDDuDuTime });

  const [isBeginTimeEnabled, setIsBeginTimeEnabled] = useState(defaultBeginTimeEnabled);
  const [isEndTimeEnabled, setIsEndTimeEnabled] = useState(defaultEndTimeEnabled);

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  const handlePressBack = () => {
    onPressBack?.();
    closeSheet();
    onClose();
  };

  const handleToggleBeginTime = (enabled: boolean) => {
    setIsBeginTimeEnabled(enabled);
    onChangeBeginTimeEnabled?.(enabled);

    if (!enabled) {
      setIsEndTimeEnabled(false);
      onChangeEndTimeEnabled?.(false);
      handleClearErrorMessage();
    }
  };

  const handleToggleEndTime = (enabled: boolean) => {
    if (!isBeginTimeEnabled && enabled) {
      return;
    }

    setIsEndTimeEnabled(enabled);
    onChangeEndTimeEnabled?.(enabled);

    if (!enabled) {
      handleClearErrorMessage();
    }
  };

  const handleConfirm = () => {
    if (!isBeginTimeEnabled) {
      onChangeDDuDuTime({ beginHour, beginMin, endHour, endMin });
      closeSheet();
      onClose();
      return;
    }

    if (!isEndTimeEnabled) {
      onChangeDDuDuTime({ beginHour, beginMin, endHour: beginHour, endMin: beginMin });
      closeSheet();
      onClose();
      return;
    }

    const isValid = handleDDuDuTimeChange();

    if (!isValid) {
      return;
    }

    closeSheet();
    onClose();
  };

  return (
    <BottomSheet
      ref={ref}
      onClose={onClose}
      fitContent
      enablePanDownToClose={false}
    >
      <View className="w-full max-w-[50rem] p-[2.4rem]">
        <View className="mb-[1.2rem]">
          <View className="mb-[0.6rem] flex-row items-center gap-[0.6rem]">
            {showBackArrow && (
              <Pressable
                onPress={handlePressBack}
                className="size-[2.4rem] items-center justify-center"
                hitSlop={8}
              >
                <ArrowLeftIcon
                  size={16}
                  stroke="#000000"
                />
              </Pressable>
            )}
            <SpoqaText
              weight="medium"
              className="text-size15"
            >
              {title}
            </SpoqaText>
          </View>

          <View className="flex-row flex-wrap justify-center gap-[1.5rem] rounded-radius10 bg-white_100 p-[1.6rem]">
            <View className="mr-[1rem]">
              <View className="mb-[1rem] flex-row items-center gap-[0.8rem]">
                <SpoqaText className="text-size13">{"\uC2DC\uC791\uC2DC\uAC04"}</SpoqaText>
                <Switch
                  value={isBeginTimeEnabled}
                  onValueChange={handleToggleBeginTime}
                  trackColor={{ false: "#D9D9D9", true: "#35CB72" }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View
                className="flex-row items-center gap-[0.5rem] rounded-radius10 px-[0.4rem] py-[0.3rem]"
                style={{ backgroundColor: isBeginTimeEnabled ? "#FFFFFF" : "#EFEFEF" }}
                pointerEvents={isBeginTimeEnabled ? "auto" : "none"}
              >
                <TimePicker
                  type="hour"
                  onChange={handleChangeBeginHour}
                  value={beginHour}
                  width={50}
                />
                <TimePicker
                  type="min"
                  onChange={handleChangeBeginMin}
                  value={beginMin}
                  width={50}
                />
              </View>
            </View>

            <View>
              <View className="mb-[1rem] flex-row items-center gap-[0.8rem]">
                <SpoqaText className="text-size13">{"\uC885\uB8CC\uC2DC\uAC04"}</SpoqaText>
                <Switch
                  value={isEndTimeEnabled}
                  onValueChange={handleToggleEndTime}
                  trackColor={{ false: "#D9D9D9", true: "#35CB72" }}
                  thumbColor="#FFFFFF"
                  disabled={!isBeginTimeEnabled}
                />
              </View>
              <View
                className="flex-row item-center gap-[0.5rem] rounded-radius10 px-[0.4rem] py-[0.3rem]"
                style={{
                  backgroundColor: isEndTimeEnabled && isBeginTimeEnabled ? "#FFFFFF" : "#EFEFEF",
                }}
                pointerEvents={isEndTimeEnabled && isBeginTimeEnabled ? "auto" : "none"}
              >
                <TimePicker
                  type="hour"
                  onChange={handleChangeEndHour}
                  value={endHour}
                  width={50}
                />
                <TimePicker
                  type="min"
                  onChange={handleChangeEndMin}
                  value={endMin}
                  width={50}
                />
              </View>
            </View>
          </View>

          {isErrorMessage && isBeginTimeEnabled && isEndTimeEnabled ? (
            <SpoqaText className="mt-[0.8rem] text-example_red_500">
              {DDUDU_TIME_SHEET.TIME_RANGE_ERROR_MESSAGE}
            </SpoqaText>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleConfirm}
          className="z-1 h-[5rem] w-full items-center justify-center rounded-radius15 bg-main"
        >
          <SpoqaText
            weight="semiBold"
            className="text-white"
          >
            {confirmLabel}
          </SpoqaText>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

export default DDuDuTimeSheet;
