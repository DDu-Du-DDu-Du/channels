import { FEED_KEY } from "@/constants/query-key/query-key";
import type { TodoTimeRangeType, TodoTimeType } from "@/features/feed/feed.types";
import { fetchTodoChangeTime } from "@/service/feed/feed";
import { deleteReminder } from "@/service/reminder/reminder";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseTodoTimeMutationProps {
  currentTodoTime: TodoTimeType;
  currentTodoId: number;
  selectedTodoDate: string;
  handleUpdateTodoTime: (TodoTime: TodoTimeType) => void;
  handleTodoTimeSheetToggleOff: () => void;
}

const useTodoTimeMutation = ({
  currentTodoTime,
  currentTodoId,
  selectedTodoDate,
  handleUpdateTodoTime,
  handleTodoTimeSheetToggleOff,
}: UseTodoTimeMutationProps) => {
  const queryClient = useQueryClient();

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
        await Promise.all(candidateReminderIds.map((reminderId) => deleteReminder(reminderId)));
      }
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.Todo_DETAIL] });
      queryClient.refetchQueries({ queryKey: [FEED_KEY.Todo_DETAIL] });
      queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE] });
      queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE, selectedTodoDate] });
      handleUpdateTodoTime({ beginAt: null, endAt: null });
      handleTodoTimeSheetToggleOff();
    },
  });

  const onChangeTodoTime = (selectedTime: TodoTimeRangeType) => {
    const { beginHour, beginMin, endHour, endMin, isBeginTimeEnabled, isEndTimeEnabled } =
      selectedTime;

    if (!isBeginTimeEnabled) {
      if (currentTodoTime.beginAt === null && currentTodoTime.endAt === null) {
        handleTodoTimeSheetToggleOff();
        return;
      }

      TodoChangeTimeMutation.mutate({
        time: {
          beginAt: null,
          endAt: null,
        },
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
    const time = {
      beginAt,
      endAt,
    };

    const isSameAsCurrent =
      currentTodoTime.beginAt === time.beginAt && currentTodoTime.endAt === time.endAt;

    if (isSameAsCurrent) {
      handleTodoTimeSheetToggleOff();
      return;
    }

    TodoChangeTimeMutation.mutate({
      time,
      id: currentTodoId,
      candidateReminderIds: selectedTime.candidateReminderIds,
    });
  };

  return {
    onChangeTodoTime,
  };
};

export default useTodoTimeMutation;
