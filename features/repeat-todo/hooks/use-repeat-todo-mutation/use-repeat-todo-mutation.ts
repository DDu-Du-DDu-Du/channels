import { useToast } from "@/components/toast/hooks";
import { normalizeDayOfWeekToKr } from "@/constants";
import { GOAL_KEY, REPEAT_Todo_KEY, STATS_KEY } from "@/constants/query-key/query-key";
import type { RepeatTodoItemType } from "@/features/repeat-todo/repeat-todo.types";
import {
  createRepeatTodo,
  deleteRepeatTodo,
  editRepeatTodo,
} from "@/service/repeat-todo/repeat-todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseRepeatTodoMutationProps {
  goalId: number;
}

function useRepeatTodoMutation({ goalId }: UseRepeatTodoMutationProps) {
  const queryClient = useQueryClient();
  const { createToast } = useToast();

  const handleMutationError = (error: unknown) => {
    const message =
      error instanceof Error ? error.message : "반복투두 처리 중 문제가 발생했습니다.";

    createToast(message, { type: "danger" });
  };

  const onSuccessMutation = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [GOAL_KEY.GOAL_DETAIL, goalId] }),
      queryClient.invalidateQueries({ queryKey: [STATS_KEY.GOAL_DETAIL_ACHIEVED, goalId] }),
      queryClient.invalidateQueries({ queryKey: [STATS_KEY.GOAL_DETAIL_POSTPONED, goalId] }),
    ]);
  };

  const createRepeatTodoMutation = useMutation({
    mutationKey: [REPEAT_Todo_KEY.REPEAT_CREATE, goalId],
    mutationFn: createRepeatTodo,
    onSuccess: onSuccessMutation,
    onError: handleMutationError,
  });

  const editRepeatTodoMutation = useMutation({
    mutationKey: [REPEAT_Todo_KEY.REPEAT_EDIT, goalId],
    mutationFn: editRepeatTodo,
    onSuccess: onSuccessMutation,
    onError: handleMutationError,
  });

  const deleteRepeatTodoMutation = useMutation({
    mutationKey: [REPEAT_Todo_KEY.REPEAT_DELETE, goalId],
    mutationFn: deleteRepeatTodo,
    onSuccess: onSuccessMutation,
    onError: handleMutationError,
  });

  const handleCreateRepeatTodo = (repeatTodo: RepeatTodoItemType) => {
    const { id, tempId, ...repeatTodoWithoutIdentity } = repeatTodo;

    createRepeatTodoMutation.mutate({
      requestRepeatTodo: {
        ...repeatTodoWithoutIdentity,
        goalId,
        repeatDaysOfWeek: repeatTodo.repeatDaysOfWeek?.map(normalizeDayOfWeekToKr),
      },
    });
  };

  const handleEditRepeatTodo = (repeatTodoId: number, repeatTodo: RepeatTodoItemType) => {
    const { id, tempId, ...repeatTodoWithoutIdentity } = repeatTodo;

    editRepeatTodoMutation.mutate({
      repeatTodoId,
      requestRepeatTodo: {
        ...repeatTodoWithoutIdentity,
        repeatDaysOfWeek: repeatTodo.repeatDaysOfWeek?.map(normalizeDayOfWeekToKr),
      },
    });
  };

  const handleDeleteRepeatTodo = (repeatTodoId: number) => {
    deleteRepeatTodoMutation.mutate({ repeatTodoId });
  };

  return {
    handleCreateRepeatTodo,
    handleEditRepeatTodo,
    handleDeleteRepeatTodo,
  };
}

export default useRepeatTodoMutation;
