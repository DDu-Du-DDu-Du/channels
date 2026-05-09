import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import AnimatedSwitch from "@/components/animated-switch/animated-switch";
import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import ConfirmModal from "@/components/confirm-modal/confirm-modal";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { TodoTimeRangeType, TodoTimeType } from "@/features/feed/feed.types";
import { useBottomSheetAction } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ArrowLeftIcon } from "@/icons";
import { parseUtc } from "@/utils";

import TimePicker from "../time-picker/time-picker";
import { useTimeUpdate } from "./hooks";

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
  reminders?: {
    id?: number;
    remindsAt: string;
    remindedAt?: string | null;
  }[];
  scheduledOn?: string;
  onRequestConfirm?: (
    nextTime: TodoTimeRangeType,
    context: { message: string; candidateReminderIds: number[] },
  ) => Promise<boolean> | boolean;
}

function TodoTimeSheet({
  currentTodoTime,
  onChangeTodoTime,
  onClose,
  title,
  showBackArrow = false,
  onPressBack,
  confirmLabel,
  defaultBeginTimeEnabled,
  defaultEndTimeEnabled,
  onChangeBeginTimeEnabled,
  onChangeEndTimeEnabled,
  reminders = [],
  scheduledOn,
  onRequestConfirm,
}: TodoTimeSheetProps) {
  const { t } = useTranslation();
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
    handleChangeBeginHour: handleSetBeginHour,
    handleChangeBeginMin: handleSetBeginMin,
    handleChangeEndHour,
    handleChangeEndMin,
    handleClearErrorMessage,
  } = useTimeUpdate({ currentTodoTime });

  const [isBeginTimeEnabled, setIsBeginTimeEnabled] = useState(
    defaultBeginTimeEnabled ?? Boolean(currentTodoTime.beginAt),
  );
  const [isEndTimeEnabled, setIsEndTimeEnabled] = useState(
    defaultEndTimeEnabled ?? Boolean(currentTodoTime.endAt),
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmInProgress, setConfirmInProgress] = useState(false);
  const [candidateReminderIds, setCandidateReminderIds] = useState<number[]>([]);
  const initialBeginAtRef = useRef(currentTodoTime.beginAt);
  const initialRemindersRef = useRef(reminders);
  const confirmResolverRef = useRef<((isComplete: boolean) => void) | null>(null);

  const getCandidateReminderInfo = (
    nextBeginAt: string | null,
    targetReminders: { id?: number; remindsAt: string; remindedAt?: string | null }[] = reminders,
  ) => {
    if (!scheduledOn || targetReminders.length === 0) {
      return { candidateReminderIds: [], candidateCount: 0 };
    }

    if (!nextBeginAt) {
      return {
        candidateReminderIds: targetReminders
          .map((reminder) => reminder.id)
          .filter((id): id is number => typeof id === "number"),
        candidateCount: targetReminders.length,
      };
    }

    const startAt = new Date(`${scheduledOn}T${nextBeginAt}`);
    if (Number.isNaN(startAt.getTime())) {
      return { candidateReminderIds: [], candidateCount: 0 };
    }

    const matched = targetReminders.filter((reminder) => {
      try {
        return parseUtc(reminder.remindsAt).getTime() >= startAt.getTime();
      } catch {
        return false;
      }
    });

    return {
      candidateReminderIds: matched
        .map((reminder) => reminder.id)
        .filter((id): id is number => typeof id === "number"),
      candidateCount: matched.length,
    };
  };

  const buildBeginAt = (hour: number, min: number) =>
    `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:00`;

  const toMinute = (hour: number, min: number) => hour * 60 + min;

  const openLocalConfirmModal = (message: string) =>
    new Promise<boolean>((resolve) => {
      confirmResolverRef.current = resolve;
      setConfirmMessage(message);
      setIsConfirmModalOpen(true);
    });

  const requestDeleteConfirm = async (
    nextTime: TodoTimeRangeType,
    message: string,
    candidateIds: number[],
  ) => {
    if (candidateIds.length === 0) {
      return true;
    }

    if (onRequestConfirm) {
      return onRequestConfirm(nextTime, {
        message,
        candidateReminderIds: candidateIds,
      });
    }

    return openLocalConfirmModal(message);
  };

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  useEffect(() => {
    initialBeginAtRef.current = currentTodoTime.beginAt;
    initialRemindersRef.current = reminders;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePressBack = () => {
    onPressBack?.();
    closeSheet();
    onClose();
  };

  const handleToggleBeginTime = async (enabled: boolean) => {
    if (confirmInProgress) {
      return;
    }

    if (!enabled) {
      const nextTime: TodoTimeRangeType = {
        beginHour,
        beginMin,
        endHour,
        endMin,
        isBeginTimeEnabled: false,
        isEndTimeEnabled: false,
      };
      const candidateInfo =
        initialBeginAtRef.current === null
          ? { candidateReminderIds: [], candidateCount: 0 }
          : getCandidateReminderInfo(null, initialRemindersRef.current);

      if (candidateInfo.candidateCount > 0) {
        setConfirmInProgress(true);
        const canProceed = await requestDeleteConfirm(
          nextTime,
          t("todo.timeSheet.missingStartRemindersDeleted"),
          candidateInfo.candidateReminderIds,
        );
        setConfirmInProgress(false);

        if (!canProceed) {
          return;
        }
      }

      setCandidateReminderIds(candidateInfo.candidateReminderIds);
      setIsBeginTimeEnabled(false);
      setIsEndTimeEnabled(false);
      handleClearErrorMessage();
      return;
    }

    const restoredCandidateInfo = getCandidateReminderInfo(
      buildBeginAt(beginHour, beginMin),
      initialRemindersRef.current,
    );
    setCandidateReminderIds(restoredCandidateInfo.candidateReminderIds);
    setIsBeginTimeEnabled(true);
  };

  const handleToggleEndTime = (enabled: boolean) => {
    if (!isBeginTimeEnabled && enabled) {
      return;
    }

    setIsEndTimeEnabled(enabled);

    if (!enabled) {
      handleClearErrorMessage();
    }
  };

  const handleChangeBeginTimeWithValidation = async (nextHour: number, nextMin: number) => {
    if (confirmInProgress || !isBeginTimeEnabled) {
      return;
    }

    const previousMinute = toMinute(beginHour, beginMin);
    const nextMinute = toMinute(nextHour, nextMin);
    const nextBeginAt = buildBeginAt(nextHour, nextMin);
    const candidateInfo = getCandidateReminderInfo(nextBeginAt, initialRemindersRef.current);

    if (nextMinute < previousMinute && candidateInfo.candidateCount > 0) {
      const nextTime: TodoTimeRangeType = {
        beginHour: nextHour,
        beginMin: nextMin,
        endHour,
        endMin,
        isBeginTimeEnabled: true,
        isEndTimeEnabled,
      };

      setConfirmInProgress(true);
      const canProceed = await requestDeleteConfirm(
        nextTime,
        t("todo.timeSheet.lateRemindersDeleted"),
        candidateInfo.candidateReminderIds,
      );
      setConfirmInProgress(false);

      if (!canProceed) {
        return;
      }
    }

    handleSetBeginHour(nextHour);
    handleSetBeginMin(nextMin);
    setCandidateReminderIds(candidateInfo.candidateReminderIds);
  };

  const handleChangeBeginHour = (nextHour: number) => {
    void handleChangeBeginTimeWithValidation(nextHour, beginMin);
  };

  const handleChangeBeginMin = (nextMin: number) => {
    void handleChangeBeginTimeWithValidation(beginHour, nextMin);
  };

  const handleConfirm = () => {
    if (isBeginTimeEnabled && isEndTimeEnabled) {
      const isValid = handleTodoTimeChange();
      if (!isValid) {
        return;
      }
    }

    const payload: TodoTimeRangeType = {
      beginHour,
      beginMin,
      endHour,
      endMin,
      isBeginTimeEnabled,
      isEndTimeEnabled: isBeginTimeEnabled ? isEndTimeEnabled : false,
      candidateReminderIds,
    };

    onChangeBeginTimeEnabled?.(payload.isBeginTimeEnabled);
    onChangeEndTimeEnabled?.(payload.isEndTimeEnabled);
    onChangeTodoTime(payload);
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
              {title ?? t("todo.timeSheet.title")}
            </SpoqaText>
          </View>

          <View className="flex-row justify-center gap-[1rem] rounded-radius10 bg-role-surface-canvas dark:bg-role-dark-surface-canvas p-[1.6rem]">
            <View className="mr-[1rem]">
              <View className="mb-[1rem] flex-row items-center gap-[0.8rem]">
                <SpoqaText className="text-size13 text-role-text-primary dark:text-role-dark-text-primary">
                  {t("todo.timeSheet.startTime")}
                </SpoqaText>
                <AnimatedSwitch
                  value={isBeginTimeEnabled}
                  onValueChange={handleToggleBeginTime}
                  offBackgroundColor={switchOffTrackColor}
                  onBackgroundColor={switchOnTrackColor}
                  thumbColor={switchThumbColor}
                />
              </View>
              <View
                className="flex-row items-center gap-[0.5rem] rounded-radius10 px-[0.4rem] py-[1rem]"
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
                  {t("todo.timeSheet.endTime")}
                </SpoqaText>
                <AnimatedSwitch
                  value={isEndTimeEnabled}
                  onValueChange={handleToggleEndTime}
                  offBackgroundColor={switchOffTrackColor}
                  onBackgroundColor={switchOnTrackColor}
                  thumbColor={switchThumbColor}
                  disabled={!isBeginTimeEnabled}
                />
              </View>
              <View
                className="flex-row item-center gap-[0.5rem] rounded-radius10 px-[0.4rem] py-[1rem]"
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
              {t("todo.timeSheet.invalidRange")}
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
            {confirmLabel ?? t("common.confirm")}
          </SpoqaText>
        </Pressable>
      </View>
      <ConfirmModal
        isToggle={isConfirmModalOpen}
        title={t("common.confirm")}
        message={confirmMessage}
        completeText={t("common.continue")}
        incompleteText={t("common.cancel")}
        handleToggleOff={() => {
          setIsConfirmModalOpen(false);
          confirmResolverRef.current?.(false);
          confirmResolverRef.current = null;
        }}
        onCompleteCheck={(isComplete) => {
          setIsConfirmModalOpen(false);
          confirmResolverRef.current?.(isComplete);
          confirmResolverRef.current = null;
        }}
      />
    </BottomSheet>
  );
}

export default TodoTimeSheet;
