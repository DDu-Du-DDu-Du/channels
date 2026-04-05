import { useState } from "react";

import { FEED_KEY } from "@/constants/query-key/query-key";
import type { TodoTimeRangeType, TodoTimeType } from "@/features/feed/feed.types";
import { useReminderMutations } from "@/features/reminder";
import { useToggle } from "@/hooks";
import {
  fetchCompleteToggleTodo,
  fetchDeleteTodo,
  fetchTodoChangeDate,
  fetchTodoChangeTime,
  fetchTodoRepeatDate,
} from "@/service/feed/feed";
import { formatDateToYYYYMMDD } from "@/utils";
import handleInvalidateTodoLinkedQueries from "@/utils/invalidate-todo-linked-queries/invalidate-todo-linked-queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseTodosearchActionsProps {
  onRefetchSearch: () => void;
}

function useTodosearchActions({ onRefetchSearch }: UseTodosearchActionsProps) {
  const queryClient = useQueryClient();
  const { handleDeleteReminderBatch } = useReminderMutations({
    includeSearch: true,
    shouldInvalidateOnSuccess: false,
  });
  const [currentTodoId, setCurrentTodoId] = useState(-1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [currentDate, setCurrentDate] = useState("");
  const [currentCalendarType, setCurrentCalendarType] = useState<"repeat" | "change">("change");
  const [currentTodoTime, setCurrentTodoTime] = useState<TodoTimeType>({
    beginAt: null,
    endAt: null,
  });
  const [currentTodoSchedule, setCurrentTodoSchedule] = useState<{
    scheduledOn: string;
    reminders: { id?: number; remindsAt: string; remindedAt?: string | null }[];
  }>({
    scheduledOn: "",
    reminders: [],
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

  const handleRefetchLinkedQueries = async () => {
    await handleInvalidateTodoLinkedQueries(queryClient, {
      includeSearch: true,
    });
    onRefetchSearch();
  };

  const completeToggleTodoMutation = useMutation({
    mutationKey: [FEED_KEY.COMPLETE_TOGGLE],
    mutationFn: fetchCompleteToggleTodo,
    onSuccess: async () => {
      await handleRefetchLinkedQueries();
    },
  });

  const deleteTodoMutation = useMutation({
    mutationKey: [FEED_KEY.DELETE_Todo],
    mutationFn: fetchDeleteTodo,
    onSuccess: async () => {
      await handleRefetchLinkedQueries();
      handleTodosheetToggleOff();
    },
  });

  const TodoChangeDateMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_CHANGE_DATE],
    mutationFn: fetchTodoChangeDate,
    onSuccess: async () => {
      await handleRefetchLinkedQueries();
      setSelectedDate(undefined);
      handleCalendarSheetToggleOff();
    },
  });

  const TodoRepeatDateMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_REPEAT_DATE],
    mutationFn: fetchTodoRepeatDate,
    onSuccess: async () => {
      await handleRefetchLinkedQueries();
      setSelectedDate(undefined);
      handleCalendarSheetToggleOff();
      handleTodosheetToggleOff();
    },
  });

  const TodoChangeTimeMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_CHANGE_TIME],
    mutationFn: async ({
      id,
      time,
      candidateReminderIds,
    }: {
      id: number;
      time: TodoTimeType;
      candidateReminderIds?: number[];
    }) => {
      await fetchTodoChangeTime({ id, time });

      return { candidateReminderIds: candidateReminderIds ?? [] };
    },
    onSuccess: async ({ candidateReminderIds }) => {
      if (candidateReminderIds.length > 0) {
        await handleDeleteReminderBatch(candidateReminderIds);
      }
      await handleRefetchLinkedQueries();
      setCurrentTodoTime({ beginAt: null, endAt: null });
      handleTodoTimeSheetToggleOff();
    },
  });

  const handleTodosheetOpen = (id: number) => {
    setCurrentTodoId(id);
    handleTodosheetToggleOn();
  };

  const handleTodoCompleteToggle = (id: number) => {
    if (completeToggleTodoMutation.isPending || deleteTodoMutation.isPending) {
      return;
    }

    completeToggleTodoMutation.mutate({ id });
  };

  const handleDeleteTodo = (id: number) => {
    if (deleteTodoMutation.isPending) {
      return;
    }

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
    if (TodoChangeDateMutation.isPending || TodoRepeatDateMutation.isPending) {
      return;
    }

    const date = formatDateToYYYYMMDD(nextDate);

    if (currentCalendarType === "change") {
      TodoChangeDateMutation.mutate({ id: currentTodoId, date });
      return;
    }

    TodoRepeatDateMutation.mutate({ id: currentTodoId, date });
  };

  const handleRepeatCurrentDate = () => {
    if (TodoRepeatDateMutation.isPending || TodoChangeDateMutation.isPending) {
      return;
    }

    TodoRepeatDateMutation.mutate({
      id: currentTodoId,
      date: formatDateToYYYYMMDD(new Date()),
    });
  };

  const handleChangeCurrentDate = () => {
    if (TodoChangeDateMutation.isPending || TodoRepeatDateMutation.isPending) {
      return;
    }

    TodoChangeDateMutation.mutate(
      {
        id: currentTodoId,
        date: formatDateToYYYYMMDD(new Date()),
      },
      {
        onSuccess: async () => {
          await handleRefetchLinkedQueries();
          setSelectedDate(undefined);
          handleCalendarSheetToggleOff();
          handleTodosheetToggleOff();
        },
      },
    );
  };

  const handleTodoTimeSetting = (
    beginAt: string | null = null,
    endAt: string | null = null,
    scheduledOn: string = "",
    reminders: { id?: number; remindsAt: string; remindedAt?: string | null }[] = [],
  ) => {
    setCurrentTodoTime({ beginAt, endAt });
    setCurrentTodoSchedule({
      scheduledOn,
      reminders,
    });
    handleTodoTimeSheetToggleOn();
    handleTodosheetToggleOff();
  };

  const handleChangeTodoTime = (selectedTime: TodoTimeRangeType) => {
    if (TodoChangeTimeMutation.isPending) {
      return;
    }

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
        candidateReminderIds: selectedTime.candidateReminderIds,
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
      candidateReminderIds: selectedTime.candidateReminderIds,
    });
  };

  const handleAlarmSetting = () => {
    handleAlarmSheetToggleOn();
    handleTodosheetToggleOff();
  };

  return {
    currentTodoId,
    currentTodoTime,
    currentTodoSchedule,
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
    handleTodoTimeSetting,
    handleChangeTodoTime,
    handleTodosheetToggleOff,
    handleTodoSheetToggleOff: handleTodosheetToggleOff,
    handleAlarmSheetToggleOff,
    handleCalendarSheetToggleOff,
    handleTodoTimeSheetToggleOff,
    isDeletePending: deleteTodoMutation.isPending,
    isChangeDatePending: TodoChangeDateMutation.isPending,
    isRepeatDatePending: TodoRepeatDateMutation.isPending,
    isChangeTimePending: TodoChangeTimeMutation.isPending,
    isCompleteTogglePending: completeToggleTodoMutation.isPending,
  };
}

export default useTodosearchActions;
