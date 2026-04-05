import { FEED_KEY } from "@/constants/query-key/query-key";
import { fetchCompleteToggleTodo, fetchDeleteTodo } from "@/service/feed/feed";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseTodoMutationProps {
  selectedTodoDate: string;
  handleTodosheetToggleOff: () => void;
}

const useTodoMutation = ({ selectedTodoDate, handleTodosheetToggleOff }: UseTodoMutationProps) => {
  const queryClient = useQueryClient();

  const handleSuccessTodo = () => {
    queryClient.refetchQueries({ queryKey: [FEED_KEY.MONTHLY_Todos] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.WEEKLY_Todos] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_LIST, selectedTodoDate] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE, selectedTodoDate] });
  };

  const deleteTodoMutation = useMutation({
    mutationKey: [FEED_KEY.DELETE_Todo],
    mutationFn: fetchDeleteTodo,
    onSuccess: () => {
      handleSuccessTodo();
      handleTodosheetToggleOff();
    },
  });

  const completeToggleTodoMutation = useMutation({
    mutationKey: [FEED_KEY.COMPLETE_TOGGLE],
    mutationFn: fetchCompleteToggleTodo,
    onSuccess: handleSuccessTodo,
  });

  const onTodoCompleteToggle = (id: number) => {
    if (completeToggleTodoMutation.isPending || deleteTodoMutation.isPending) {
      return;
    }

    completeToggleTodoMutation.mutate({ id });
  };

  const onDeleteTodo = (id: number) => {
    if (deleteTodoMutation.isPending) {
      return;
    }

    deleteTodoMutation.mutate({ id });
  };

  return {
    onTodoCompleteToggle,
    onDeleteTodo,
    isDeletePending: deleteTodoMutation.isPending,
    isCompleteTogglePending: completeToggleTodoMutation.isPending,
  };
};

export default useTodoMutation;
