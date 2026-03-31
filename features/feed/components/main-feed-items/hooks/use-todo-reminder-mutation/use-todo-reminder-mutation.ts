import { FEED_KEY } from "@/constants/query-key/query-key";
import { fetchTodoCancelReminder, fetchTodoChangeReminder } from "@/service/feed/feed";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ReminderConfirmPayload {
  enabled: boolean;
  day: number;
  hour: number;
  minute: number;
}

interface UseTodoReminderMutationProps {
  currentTodoId: number;
  selectedTodoDate: string;
}

const useTodoReminderMutation = ({
  currentTodoId,
  selectedTodoDate,
}: UseTodoReminderMutationProps) => {
  const queryClient = useQueryClient();

  const TodoChangeReminderMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_CHANGE_REMINDER],
    mutationFn: fetchTodoChangeReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.Todo_DETAIL] });
      queryClient.refetchQueries({ queryKey: [FEED_KEY.Todo_DETAIL, currentTodoId] });
      queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_LIST, selectedTodoDate] });
      queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE, selectedTodoDate] });
    },
  });

  const TodoCancelReminderMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_CHANGE_REMINDER],
    mutationFn: fetchTodoCancelReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.Todo_DETAIL] });
      queryClient.refetchQueries({ queryKey: [FEED_KEY.Todo_DETAIL, currentTodoId] });
      queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_LIST, selectedTodoDate] });
      queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE, selectedTodoDate] });
    },
  });

  const handleChangeTodoReminder = ({ enabled, day, hour, minute }: ReminderConfirmPayload) => {
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
    handleChangeTodoReminder,
  };
};

export default useTodoReminderMutation;
