import { useEffect } from "react";
import { View } from "react-native";

import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import { FEED_KEY } from "@/constants/query-key/query-key";
import { useBottomSheetAction } from "@/hooks";
import { getTodoDetail } from "@/service/feed/feed";
import { formatDateToYYYYMMDD } from "@/utils";
import { useQuery } from "@tanstack/react-query";

import { TodoActionGrid, TodoFixedRows } from "./components";
import type { TodoDetailType } from "./todo-sheet.types";

export interface TodosheetProps {
  type?: "Todo" | "schedule";
  TodoId: number;
  handleEditTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  handleTodosheetToggleOff?: () => void;
  handleTodoSheetToggleOff?: () => void;
  handleSelectDifferentDate: (type: "change" | "repeat", currentDate: string) => void;
  handleAlarmSetting: () => void;
  handleTodoTimeSetting: (
    beginAt?: string,
    endAt?: string,
    scheduledOn?: string,
    reminders?: TodoDetailType["reminders"],
  ) => void;
  onRepeatCurrentDate: () => void;
  onChangeCurrentDate: () => void;
  isDeletePending?: boolean;
  isChangeDatePending?: boolean;
  isRepeatDatePending?: boolean;
  isChangeTimePending?: boolean;
  isCompleteTogglePending?: boolean;
}

function Todosheet({
  type = "Todo",
  TodoId,
  handleEditTodo,
  onDeleteTodo,
  handleTodosheetToggleOff,
  handleTodoSheetToggleOff,
  handleSelectDifferentDate,
  handleAlarmSetting,
  handleTodoTimeSetting,
  onRepeatCurrentDate,
  onChangeCurrentDate,
  isDeletePending = false,
  isChangeDatePending = false,
  isRepeatDatePending = false,
  isChangeTimePending = false,
  isCompleteTogglePending = false,
}: TodosheetProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  const handleClose = () => {
    closeSheet();
    (handleTodosheetToggleOff ?? handleTodoSheetToggleOff)?.();
  };

  const { data: TodoDetail } = useQuery<TodoDetailType | undefined>({
    queryKey: [FEED_KEY.Todo_DETAIL, TodoId],
    queryFn: () => getTodoDetail({ id: TodoId }),
    enabled: TodoId > 0,
  });

  const buildTopActions = (detail: TodoDetailType) => {
    const { scheduledOn, beginAt, endAt, status } = detail;
    const now = new Date();
    const today = formatDateToYYYYMMDD(now);
    const isToday = scheduledOn === today;

    let isPast = false;
    let isFuture = false;

    if (scheduledOn < today) {
      isPast = true;
    } else if (scheduledOn > today) {
      isFuture = true;
    } else if (!beginAt) {
      isFuture = true;
    } else {
      const currentDateTime = new Date(`${scheduledOn}T${beginAt}`);
      if (Number.isNaN(currentDateTime.getTime())) {
        isFuture = true;
      } else {
        isPast = currentDateTime <= now;
        isFuture = currentDateTime > now;
      }
    }

    const handleChangeToDifferentDate = () => {
      handleSelectDifferentDate("change", scheduledOn);
    };

    const handleRepeatToDifferentDate = () => {
      handleSelectDifferentDate("repeat", scheduledOn);
    };

    const handleOpenTimeSetting = () => {
      handleTodoTimeSetting(
        beginAt ?? undefined,
        endAt ?? undefined,
        scheduledOn,
        detail.reminders,
      );
    };

    if (isPast && status === "UNCOMPLETED") {
      if (isToday) {
        return [
          {
            key: "change-another-day",
            title: "다른 날로 미루기",
            onPress: handleChangeToDifferentDate,
          },
          {
            key: "repeat-another-day",
            title: "다른 날 다시하기",
            onPress: handleRepeatToDifferentDate,
          },
          { key: "time-setting", title: "시간설정", onPress: handleOpenTimeSetting },
        ];
      }

      return [
        { key: "change-today", title: "오늘로 미루기", onPress: onChangeCurrentDate },
        {
          key: "change-another-day",
          title: "다른 날로 미루기",
          onPress: handleChangeToDifferentDate,
        },
        { key: "time-setting", title: "시간설정", onPress: handleOpenTimeSetting },
        { key: "repeat-today", title: "오늘 다시하기", onPress: onRepeatCurrentDate },
        {
          key: "repeat-another-day",
          title: "다른 날 다시하기",
          onPress: handleRepeatToDifferentDate,
        },
      ];
    }

    if (isPast && status === "COMPLETE") {
      if (isToday) {
        return [
          {
            key: "repeat-another-day",
            title: "다른 날 다시하기",
            onPress: handleRepeatToDifferentDate,
          },
          { key: "time-setting", title: "시간설정", onPress: handleOpenTimeSetting },
        ];
      }

      return [
        { key: "repeat-today", title: "오늘 다시하기", onPress: onRepeatCurrentDate },
        {
          key: "repeat-another-day",
          title: "다른 날 다시하기",
          onPress: handleRepeatToDifferentDate,
        },
        { key: "time-setting", title: "시간설정", onPress: handleOpenTimeSetting },
      ];
    }

    if (isFuture && status === "UNCOMPLETED") {
      return [
        { key: "change-date", title: "날짜 바꾸기", onPress: handleChangeToDifferentDate },
        { key: "copy-date", title: "복사하기", onPress: handleRepeatToDifferentDate },
        { key: "time-setting", title: "시간설정", onPress: handleOpenTimeSetting },
        {
          key: "alarm-setting",
          title: "미리알림",
          onPress: handleAlarmSetting,
        },
      ];
    }

    if (isFuture && status === "COMPLETE") {
      return [
        { key: "change-date", title: "날짜 바꾸기", onPress: handleChangeToDifferentDate },
        { key: "copy-date", title: "복사하기", onPress: handleRepeatToDifferentDate },
        { key: "time-setting", title: "시간설정", onPress: handleOpenTimeSetting },
      ];
    }

    return [
      { key: "change-date", title: "날짜 바꾸기", onPress: handleChangeToDifferentDate },
      { key: "copy-date", title: "복사하기", onPress: handleRepeatToDifferentDate },
      { key: "time-setting", title: "시간설정", onPress: handleOpenTimeSetting },
    ];
  };

  return (
    <BottomSheet
      ref={ref}
      onClose={handleClose}
      fitContent
    >
      {TodoDetail && (
        <View className="w-full flex flex-col items-center gap-[1.4rem] bg-role-surface-panel px-[3rem] py-[1rem] dark:bg-role-dark-surface-panel">
          <TodoActionGrid
            actions={buildTopActions(TodoDetail)}
            isChangeDatePending={isChangeDatePending}
            isRepeatDatePending={isRepeatDatePending}
            isChangeTimePending={isChangeTimePending}
          />
          <TodoFixedRows
            type={type}
            TodoId={TodoId}
            handleEditTodo={handleEditTodo}
            onDeleteTodo={onDeleteTodo}
            handleTodosheetToggleOff={handleClose}
            isDeletePending={isDeletePending}
            isEditDisabled={
              isDeletePending ||
              isChangeDatePending ||
              isRepeatDatePending ||
              isChangeTimePending ||
              isCompleteTogglePending
            }
          />
        </View>
      )}
    </BottomSheet>
  );
}

export default Todosheet;
