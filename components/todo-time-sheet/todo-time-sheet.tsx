import { useEffect, useState } from "react";
import { Pressable, Switch, View } from "react-native";

import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { TodoTimeRangeType, TodoTimeType } from "@/features/feed/feed.types";
import { useBottomSheetAction } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ArrowLeftIcon } from "@/icons";

import TimePicker from "../time-picker/time-picker";
import { useTimeUpdate } from "./hooks";
import { Todo_TIME_SHEET } from "./todo-time-sheet.constant";

export interface TodoTimeSheetProps {
  currentTodoTime: TodoTimeType;
  onChangeTodoTime: (selectedTime: TodoTimeRangeType) => void;
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

function TodoTimeSheet({
  currentTodoTime,
  onChangeTodoTime,
  onClose,
  title = "투두시간 설정",
  showBackArrow = false,
  onPressBack,
  confirmLabel = "확인",
  defaultBeginTimeEnabled,
  defaultEndTimeEnabled,
  onChangeBeginTimeEnabled,
  onChangeEndTimeEnabled,
}: TodoTimeSheetProps) {
  const iconStrokeColor = useThemeColorToken("role.icon.default");
  const switchOffTrackColor = useThemeColorToken("role.border.default");
  const switchOnTrackColor = useThemeColorToken("role.status.success");
  const switchThumbColor = useThemeColorToken("role.surface.canvas");
  const enabledPickerBgColor = useThemeColorToken("role.surface.canvas");
  const disabledPickerBgColor = useThemeColorToken("role.surface.subtle");

  const { ref, openSheet, closeSheet } = useBottomSheetAction();
  const {
    beginHour,
    beginMin,
    endHour,
    endMin,
    isErrorMessage,
    handleTodoTimeChange,
    handleChangeBeginHour,
    handleChangeBeginMin,
    handleChangeEndHour,
    handleChangeEndMin,
    handleClearErrorMessage,
  } = useTimeUpdate({ currentTodoTime, onChangeTodoTime });

  const [isBeginTimeEnabled, setIsBeginTimeEnabled] = useState(
    defaultBeginTimeEnabled ?? Boolean(currentTodoTime.beginAt),
  );
  const [isEndTimeEnabled, setIsEndTimeEnabled] = useState(
    defaultEndTimeEnabled ?? Boolean(currentTodoTime.endAt),
  );

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
      onChangeTodoTime({
        beginHour,
        beginMin,
        endHour,
        endMin,
        isBeginTimeEnabled: false,
        isEndTimeEnabled: false,
      });
      closeSheet();
      onClose();
      return;
    }

    if (!isEndTimeEnabled) {
      onChangeTodoTime({
        beginHour,
        beginMin,
        endHour,
        endMin,
        isBeginTimeEnabled: true,
        isEndTimeEnabled: false,
      });
      closeSheet();
      onClose();
      return;
    }

    const isValid = handleTodoTimeChange();

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
      <View className="w-full max-w-[50rem] bg-role-surface-panel p-[2.4rem] dark:bg-role-dark-surface-panel">
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
                  stroke={iconStrokeColor}
                />
              </Pressable>
            )}
            <SpoqaText
              weight="medium"
              className="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
            >
              {title}
            </SpoqaText>
          </View>

          <View className="flex-row justify-center gap-[1rem] rounded-radius10 bg-role-surface-canvas dark:bg-role-dark-surface-canvas p-[1.6rem]">
            <View className="mr-[1rem]">
              <View className="mb-[1rem] flex-row items-center gap-[0.8rem]">
                <SpoqaText className="text-size13 text-role-text-primary dark:text-role-dark-text-primary">
                  시작시간
                </SpoqaText>
                <Switch
                  value={isBeginTimeEnabled}
                  onValueChange={handleToggleBeginTime}
                  trackColor={{ false: switchOffTrackColor, true: switchOnTrackColor }}
                  thumbColor={switchThumbColor}
                />
              </View>
              <View
                className="flex-row items-center gap-[0.5rem] rounded-radius10 px-[0.4rem] py-[0.3rem]"
                style={{
                  backgroundColor: isBeginTimeEnabled
                    ? enabledPickerBgColor
                    : disabledPickerBgColor,
                  pointerEvents: isBeginTimeEnabled ? "auto" : "none",
                }}
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
                <SpoqaText className="text-size13 text-role-text-primary dark:text-role-dark-text-primary">
                  종료시간
                </SpoqaText>
                <Switch
                  value={isEndTimeEnabled}
                  onValueChange={handleToggleEndTime}
                  trackColor={{ false: switchOffTrackColor, true: switchOnTrackColor }}
                  thumbColor={switchThumbColor}
                  disabled={!isBeginTimeEnabled}
                />
              </View>
              <View
                className="flex-row item-center gap-[0.5rem] rounded-radius10 px-[0.4rem] py-[0.3rem]"
                style={{
                  backgroundColor:
                    isEndTimeEnabled && isBeginTimeEnabled
                      ? enabledPickerBgColor
                      : disabledPickerBgColor,
                  pointerEvents: isEndTimeEnabled && isBeginTimeEnabled ? "auto" : "none",
                }}
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
            <SpoqaText className="mt-[0.8rem] text-role-status-error dark:text-role-dark-status-error">
              {Todo_TIME_SHEET.TIME_RANGE_ERROR_MESSAGE}
            </SpoqaText>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleConfirm}
          className="z-1 h-[5rem] w-full items-center justify-center rounded-radius15 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg"
        >
          <SpoqaText
            weight="semiBold"
            className="text-role-text-inverse dark:text-role-dark-text-inverse"
          >
            {confirmLabel}
          </SpoqaText>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

export default TodoTimeSheet;
