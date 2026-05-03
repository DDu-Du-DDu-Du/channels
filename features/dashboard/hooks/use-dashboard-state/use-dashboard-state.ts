import { useMemo, useRef, useState } from "react";

import { FEED_KEY, Todo_KEY } from "@/constants/query-key/query-key";
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
import { getTodoDashboard } from "@/service/todo/todo";
import type {
  TodoDashboardContentType,
  TodoDashboardResponseType,
  TodoStatusType,
} from "@/types/response/todo/todo";
import { formatDateToYYYYMMDD } from "@/utils";
import handleInvalidateTodoLinkedQueries from "@/utils/invalidate-todo-linked-queries/invalidate-todo-linked-queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type DashboardStatusFilterType = "ALL" | TodoStatusType;

const todayString = () => formatDateToYYYYMMDD(new Date());

const toggleTodoStatus = (status: TodoStatusType): TodoStatusType =>
  status === "COMPLETE" ? "UNCOMPLETED" : "COMPLETE";

const getDateByIndex = (contents: TodoDashboardContentType[], index: number) => {
  if (!Number.isInteger(index) || index < 0 || index >= contents.length) {
    return todayString();
  }

  return contents[index]?.date ?? todayString();
};

function useDashboardState() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<DashboardStatusFilterType>("ALL");
  const [pendingCompleteTodoIds, setPendingCompleteTodoIds] = useState<Set<number>>(
    () => new Set(),
  );
  const pendingCompleteTodoIdsRef = useRef(new Set<number>());
  const [currentTodoId, setCurrentTodoId] = useState(-1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [currentDate, setCurrentDate] = useState("");
  const [currentCalendarType, setCurrentCalendarType] = useState<"repeat" | "change">("change");
  const [moveToSelectedDate, setMoveToSelectedDate] = useState<Date | undefined>(
    () => new Date(todayString()),
  );
  const [selectedDashboardDate, setSelectedDashboardDate] = useState(() => todayString());
  const [pendingScrollDate, setPendingScrollDate] = useState<string | null>(null);
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
    isToggle: isTodoSheetToggle,
    handleToggleOn: handleTodoSheetToggleOn,
    handleToggleOff: handleTodoSheetToggleOff,
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
    isToggle: isMoveToCalendarToggle,
    handleToggleOn: handleMoveToCalendarToggleOn,
    handleToggleOff: handleMoveToCalendarToggleOff,
  } = useToggle();
  const {
    isToggle: isTodoTimeSheetToggle,
    handleToggleOn: handleTodoTimeSheetToggleOn,
    handleToggleOff: handleTodoTimeSheetToggleOff,
  } = useToggle();

  const dashboardQuery = useQuery<TodoDashboardResponseType>({
    queryKey: [Todo_KEY.DASHBOARD],
    queryFn: getTodoDashboard,
  });

  const { handleDeleteReminderBatch } = useReminderMutations({
    shouldInvalidateOnSuccess: false,
  });

  const todayDate = useMemo(() => {
    const contents = dashboardQuery.data?.contents ?? [];

    return getDateByIndex(contents, dashboardQuery.data?.todayIndex ?? -1);
  }, [dashboardQuery.data?.contents, dashboardQuery.data?.todayIndex]);

  const visibleSections = useMemo<TodoDashboardContentType[]>(() => {
    const contents = dashboardQuery.data?.contents ?? [];
    const filteredSections = contents
      .map((section) => ({
        ...section,
        todos:
          selectedStatus === "ALL"
            ? section.todos
            : section.todos.filter((todo) => todo.status === selectedStatus),
      }))
      .filter((section) => section.todos.length > 0 || section.date === todayDate);

    if (filteredSections.some((section) => section.date === todayDate)) {
      return filteredSections;
    }

    const todaySection = { date: todayDate, todos: [] };
    const nextSections = [...filteredSections, todaySection];

    return nextSections.sort((left, right) => left.date.localeCompare(right.date));
  }, [dashboardQuery.data?.contents, selectedStatus, todayDate]);

  const initialScrollDate = useMemo(() => {
    return todayDate;
  }, [todayDate]);

  const resolveVisibleSectionIndex = (targetDate: string) => {
    if (visibleSections.length === 0) {
      return -1;
    }

    const exactIndex = visibleSections.findIndex((section) => section.date === targetDate);

    if (exactIndex >= 0) {
      return exactIndex;
    }

    const followingIndex = visibleSections.findIndex((section) => section.date > targetDate);

    if (followingIndex >= 0) {
      return followingIndex;
    }

    return visibleSections.length - 1;
  };

  const handleRefetchDashboardLinkedQueries = async () => {
    await handleInvalidateTodoLinkedQueries(queryClient, {
      includeDashboard: true,
    });
  };

  const completeToggleTodoMutation = useMutation<
    void,
    Error,
    { id: number },
    { previousStatus?: TodoStatusType }
  >({
    mutationKey: [FEED_KEY.COMPLETE_TOGGLE],
    mutationFn: ({ id }) => fetchCompleteToggleTodo({ id }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: [Todo_KEY.DASHBOARD] });

      let previousStatus: TodoStatusType | undefined;

      queryClient.setQueryData<TodoDashboardResponseType>([Todo_KEY.DASHBOARD], (current) => {
        if (!current) {
          return current;
        }

        let hasChanged = false;
        const contents = current.contents.map((section) => {
          let hasSectionChanged = false;
          const todos = section.todos.map((todo) => {
            if (todo.id !== id) {
              return todo;
            }

            previousStatus = todo.status;
            hasChanged = true;
            hasSectionChanged = true;

            return {
              ...todo,
              status: toggleTodoStatus(todo.status),
            };
          });

          return hasSectionChanged ? { ...section, todos } : section;
        });

        return hasChanged ? { ...current, contents } : current;
      });

      return { previousStatus };
    },
    onError: (_error, { id }, context) => {
      if (!context?.previousStatus) {
        return;
      }

      const previousStatus = context.previousStatus;

      queryClient.setQueryData<TodoDashboardResponseType>([Todo_KEY.DASHBOARD], (current) => {
        if (!current) {
          return current;
        }

        const contents = current.contents.map((section) => {
          let hasSectionChanged = false;
          const todos = section.todos.map((todo) => {
            if (todo.id !== id) {
              return todo;
            }

            hasSectionChanged = true;

            return {
              ...todo,
              status: previousStatus,
            };
          });

          return hasSectionChanged ? { ...section, todos } : section;
        });

        return { ...current, contents };
      });
    },
    onSettled: async (_data, _error, { id }) => {
      pendingCompleteTodoIdsRef.current.delete(id);
      setPendingCompleteTodoIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

      await handleRefetchDashboardLinkedQueries();
    },
  });

  const deleteTodoMutation = useMutation({
    mutationKey: [FEED_KEY.DELETE_Todo],
    mutationFn: fetchDeleteTodo,
    onSuccess: async () => {
      await handleRefetchDashboardLinkedQueries();
      handleTodoSheetToggleOff();
    },
  });

  const todoChangeDateMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_CHANGE_DATE],
    mutationFn: fetchTodoChangeDate,
    onSuccess: async () => {
      await handleRefetchDashboardLinkedQueries();
      setSelectedDate(undefined);
      handleCalendarSheetToggleOff();
    },
  });

  const todoRepeatDateMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_REPEAT_DATE],
    mutationFn: fetchTodoRepeatDate,
    onSuccess: async () => {
      await handleRefetchDashboardLinkedQueries();
      setSelectedDate(undefined);
      handleCalendarSheetToggleOff();
      handleTodoSheetToggleOff();
    },
  });

  const todoChangeTimeMutation = useMutation({
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

      await handleRefetchDashboardLinkedQueries();
      setCurrentTodoTime({ beginAt: null, endAt: null });
      handleTodoTimeSheetToggleOff();
    },
  });

  const handleSelectStatus = (status: DashboardStatusFilterType) => {
    setSelectedStatus(status);
  };

  const handleTodoSheetOpen = (id: number) => {
    setCurrentTodoId(id);
    handleTodoSheetToggleOn();
  };

  const handleTodoCompleteToggle = (id: number) => {
    if (pendingCompleteTodoIdsRef.current.has(id) || deleteTodoMutation.isPending) {
      return;
    }

    pendingCompleteTodoIdsRef.current.add(id);
    setPendingCompleteTodoIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
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
    handleTodoSheetToggleOff();
  };

  const handleSelectedDate = (nextDate: Date | undefined) => {
    setSelectedDate(nextDate);
  };

  const handleChangeTodoDate = (nextDate: Date) => {
    if (todoChangeDateMutation.isPending || todoRepeatDateMutation.isPending) {
      return;
    }

    const date = formatDateToYYYYMMDD(nextDate);

    if (currentCalendarType === "change") {
      todoChangeDateMutation.mutate({ id: currentTodoId, date });
      return;
    }

    todoRepeatDateMutation.mutate({ id: currentTodoId, date });
  };

  const handleRepeatCurrentDate = () => {
    if (todoRepeatDateMutation.isPending || todoChangeDateMutation.isPending) {
      return;
    }

    todoRepeatDateMutation.mutate({
      id: currentTodoId,
      date: todayString(),
    });
  };

  const handleChangeCurrentDate = () => {
    if (todoChangeDateMutation.isPending || todoRepeatDateMutation.isPending) {
      return;
    }

    todoChangeDateMutation.mutate(
      {
        id: currentTodoId,
        date: todayString(),
      },
      {
        onSuccess: async () => {
          await handleRefetchDashboardLinkedQueries();
          setSelectedDate(undefined);
          handleCalendarSheetToggleOff();
          handleTodoSheetToggleOff();
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
    handleTodoSheetToggleOff();
  };

  const handleChangeTodoTime = (selectedTime: TodoTimeRangeType) => {
    if (todoChangeTimeMutation.isPending) {
      return;
    }

    const { beginHour, beginMin, endHour, endMin, isBeginTimeEnabled, isEndTimeEnabled } =
      selectedTime;

    if (!isBeginTimeEnabled) {
      if (currentTodoTime.beginAt === null && currentTodoTime.endAt === null) {
        handleTodoTimeSheetToggleOff();
        return;
      }

      todoChangeTimeMutation.mutate({
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

    todoChangeTimeMutation.mutate({
      time: { beginAt, endAt },
      id: currentTodoId,
      candidateReminderIds: selectedTime.candidateReminderIds,
    });
  };

  const handleAlarmSetting = () => {
    handleAlarmSheetToggleOn();
    handleTodoSheetToggleOff();
  };

  const handleOpenMoveToCalendar = () => {
    setMoveToSelectedDate(new Date(selectedDashboardDate));
    handleMoveToCalendarToggleOn();
  };

  const handleSelectMoveToDate = (nextDate: Date | undefined) => {
    setMoveToSelectedDate(nextDate);
  };

  const handleMoveToDate = (nextDate: Date) => {
    const nextDateString = formatDateToYYYYMMDD(nextDate);

    setSelectedDashboardDate(nextDateString);
    setPendingScrollDate(nextDateString);
    handleMoveToCalendarToggleOff();
  };

  const handleClearPendingScrollDate = () => {
    setPendingScrollDate(null);
  };

  const handleRefetchDashboard = async () => {
    await dashboardQuery.refetch();
  };

  return {
    dashboardQuery,
    visibleSections,
    todayDate,
    selectedStatus,
    currentTodoId,
    selectedDate,
    currentDate,
    initialScrollDate,
    moveToSelectedDate,
    selectedDashboardDate,
    pendingScrollDate,
    currentTodoTime,
    currentTodoSchedule,
    isTodoSheetToggle,
    isAlarmSheetToggle,
    isCalendarSheetToggle,
    isMoveToCalendarToggle,
    isTodoTimeSheetToggle,
    isDeletePending: deleteTodoMutation.isPending,
    isChangeDatePending: todoChangeDateMutation.isPending,
    isRepeatDatePending: todoRepeatDateMutation.isPending,
    isChangeTimePending: todoChangeTimeMutation.isPending,
    isCompleteTogglePending: pendingCompleteTodoIds.has(currentTodoId),
    handleSelectStatus,
    handleSelectedDate,
    handleTodoSheetOpen,
    handleTodoCompleteToggle,
    handleDeleteTodo,
    handleSelectDifferentDate,
    handleChangeTodoDate,
    handleRepeatCurrentDate,
    handleChangeCurrentDate,
    handleAlarmSetting,
    handleTodoTimeSetting,
    handleChangeTodoTime,
    handleTodoSheetToggleOff,
    handleAlarmSheetToggleOff,
    handleCalendarSheetToggleOff,
    handleTodoTimeSheetToggleOff,
    handleOpenMoveToCalendar,
    handleSelectMoveToDate,
    handleMoveToDate,
    handleMoveToCalendarToggleOff,
    handleClearPendingScrollDate,
    handleRefetchDashboard,
    resolveVisibleSectionIndex,
  };
}

export default useDashboardState;
