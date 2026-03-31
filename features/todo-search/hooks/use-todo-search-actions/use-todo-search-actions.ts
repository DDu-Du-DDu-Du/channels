import { useState } from "react";

import { FEED_KEY, Todo_KEY } from "@/constants/query-key/query-key";
import type { TodoTimeRangeType, TodoTimeType } from "@/features/feed/feed.types";
import { useToggle } from "@/hooks";
import {
  fetchCompleteToggleTodo,
  fetchDeleteTodo,
  fetchTodoCancelReminder,
  fetchTodoChangeDate,
  fetchTodoChangeReminder,
  fetchTodoChangeTime,
  fetchTodoRepeatDate,
} from "@/service/feed/feed";
import { formatDateToYYYYMMDD } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseTodosearchActionsProps {
  onRefetchSearch: () => void;
}

function useTodosearchActions({ onRefetchSearch }: UseTodosearchActionsProps) {
  const queryClient = useQueryClient();
  const [currentTodoId, setCurrentTodoId] = useState(-1);
  const [hasAlarmBeginAt, setHasAlarmBeginAt] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [currentDate, setCurrentDate] = useState("");
  const [currentCalendarType, setCurrentCalendarType] = useState<"repeat" | "change">("change");
  const [currentTodoTime, setCurrentTodoTime] = useState<TodoTimeType>({
    beginAt: null,
    endAt: null,
  });

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

  const handleRefetchLinkedQueries = () => {
    queryClient.invalidateQueries({ queryKey: [Todo_KEY.SEARCH] });
    queryClient.invalidateQueries({ queryKey: [FEED_KEY.MONTHLY_Todos] });
    queryClient.invalidateQueries({ queryKey: [FEED_KEY.WEEKLY_Todos] });
    queryClient.invalidateQueries({ queryKey: [FEED_KEY.DAILY_LIST] });
    queryClient.invalidateQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE] });
    onRefetchSearch();
  };

  const completeToggleTodoMutation = useMutation({
    mutationKey: [FEED_KEY.COMPLETE_TOGGLE],
    mutationFn: fetchCompleteToggleTodo,
    onSuccess: handleRefetchLinkedQueries,
  });

  const deleteTodoMutation = useMutation({
    mutationKey: [FEED_KEY.DELETE_Todo],
    mutationFn: fetchDeleteTodo,
    onSuccess: () => {
      handleRefetchLinkedQueries();
      handleTodosheetToggleOff();
    },
  });

  const TodoChangeDateMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_CHANGE_DATE],
    mutationFn: fetchTodoChangeDate,
    onSuccess: () => {
      handleRefetchLinkedQueries();
      setSelectedDate(undefined);
      handleCalendarSheetToggleOff();
    },
  });

  const TodoRepeatDateMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_REPEAT_DATE],
    mutationFn: fetchTodoRepeatDate,
    onSuccess: () => {
      handleRefetchLinkedQueries();
      setSelectedDate(undefined);
      handleCalendarSheetToggleOff();
      handleTodosheetToggleOff();
    },
  });

  const TodoChangeTimeMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_CHANGE_TIME],
    mutationFn: fetchTodoChangeTime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.Todo_DETAIL] });
      handleRefetchLinkedQueries();
      setCurrentTodoTime({ beginAt: null, endAt: null });
      handleTodoTimeSheetToggleOff();
    },
  });

  const TodoChangeReminderMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_CHANGE_REMINDER],
    mutationFn: fetchTodoChangeReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.Todo_DETAIL] });
      handleRefetchLinkedQueries();
    },
  });

  const TodoCancelReminderMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_CHANGE_REMINDER],
    mutationFn: fetchTodoCancelReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.Todo_DETAIL] });
      handleRefetchLinkedQueries();
    },
  });

  const handleTodosheetOpen = (id: number) => {
    setCurrentTodoId(id);
    handleTodosheetToggleOn();
  };

  const handleTodoCompleteToggle = (id: number) => {
    completeToggleTodoMutation.mutate({ id });
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodoMutation.mutate({ id });
  };

  const handleSelectDifferentDate = (type: "change" | "repeat", date: string) => {
    setCurrentCalendarType(type);
    setCurrentDate(date);
    handleCalendarSheetToggleOn();
    handleTodosheetToggleOff();
  };

  const handleSelectedDate = (nextDate: Date | undefined) => {
    setSelectedDate(nextDate);
  };

  const handleChangeTodoDate = (nextDate: Date) => {
    const date = formatDateToYYYYMMDD(nextDate);

    if (currentCalendarType === "change") {
      TodoChangeDateMutation.mutate({ id: currentTodoId, date });
      return;
    }

    TodoRepeatDateMutation.mutate({ id: currentTodoId, date });
  };

  const handleRepeatCurrentDate = () => {
    TodoRepeatDateMutation.mutate({
      id: currentTodoId,
      date: formatDateToYYYYMMDD(new Date()),
    });
  };

  const handleChangeCurrentDate = () => {
    TodoChangeDateMutation.mutate(
      {
        id: currentTodoId,
        date: formatDateToYYYYMMDD(new Date()),
      },
      {
        onSuccess: () => {
          handleRefetchLinkedQueries();
          setSelectedDate(undefined);
          handleCalendarSheetToggleOff();
          handleTodosheetToggleOff();
        },
      },
    );
  };

  const handleTodoTimeSetting = (beginAt: string | null = null, endAt: string | null = null) => {
    setCurrentTodoTime({ beginAt, endAt });
    handleTodoTimeSheetToggleOn();
    handleTodosheetToggleOff();
  };

  const handleChangeTodoTime = (selectedTime: TodoTimeRangeType) => {
    const { beginHour, beginMin, endHour, endMin, isBeginTimeEnabled, isEndTimeEnabled } =
      selectedTime;

    if (!isBeginTimeEnabled) {
      if (currentTodoTime.beginAt === null && currentTodoTime.endAt === null) {
        handleTodoTimeSheetToggleOff();
        return;
      }

      TodoChangeTimeMutation.mutate({
        time: { beginAt: null, endAt: null },
        id: currentTodoId,
      });
      return;
    }

    const beginAt = `${beginHour < 10 ? `0${beginHour}` : beginHour}:${
      beginMin < 10 ? `0${beginMin}` : beginMin
    }:00`;
    const endAt = isEndTimeEnabled
      ? `${endHour < 10 ? `0${endHour}` : endHour}:${endMin < 10 ? `0${endMin}` : endMin}:00`
      : null;

    const isSameAsCurrent = currentTodoTime.beginAt === beginAt && currentTodoTime.endAt === endAt;
    if (isSameAsCurrent) {
      handleTodoTimeSheetToggleOff();
      return;
    }

    TodoChangeTimeMutation.mutate({
      time: { beginAt, endAt },
      id: currentTodoId,
    });
  };

  const handleAlarmSetting = (hasBeginAt: boolean) => {
    setHasAlarmBeginAt(hasBeginAt);
    handleAlarmSheetToggleOn();
    handleTodosheetToggleOff();
  };

  const handleChangeTodoReminder = ({
    enabled,
    day,
    hour,
    minute,
  }: {
    enabled: boolean;
    day: number;
    hour: number;
    minute: number;
  }) => {
    if (!enabled) {
      TodoCancelReminderMutation.mutate({ id: currentTodoId });
      return;
    }

    TodoChangeReminderMutation.mutate({
      id: currentTodoId,
      reminder: {
        days: day,
        hours: hour,
        minutes: minute,
      },
    });
  };

  return {
    currentTodoId,
    currentTodoTime,
    hasAlarmBeginAt,
    selectedDate,
    currentDate,
    isTodosheetToggle,
    isTodoSheetToggle: isTodosheetToggle,
    isAlarmSheetToggle,
    isCalendarSheetToggle,
    isTodoTimeSheetToggle,
    handleSelectedDate,
    handleTodosheetOpen,
    handleTodoSheetOpen: handleTodosheetOpen,
    handleTodoCompleteToggle,
    handleDeleteTodo,
    handleSelectDifferentDate,
    handleChangeTodoDate,
    handleRepeatCurrentDate,
    handleChangeCurrentDate,
    handleAlarmSetting,
    handleChangeTodoReminder,
    handleTodoTimeSetting,
    handleChangeTodoTime,
    handleTodosheetToggleOff,
    handleTodoSheetToggleOff: handleTodosheetToggleOff,
    handleAlarmSheetToggleOff,
    handleCalendarSheetToggleOff,
    handleTodoTimeSheetToggleOff,
  };
}

export default useTodosearchActions;
