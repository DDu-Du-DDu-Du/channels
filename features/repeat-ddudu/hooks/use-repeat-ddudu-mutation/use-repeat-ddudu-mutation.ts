import { useToast } from "@/components/toast/hooks";
import { normalizeDayOfWeekToKr } from "@/constants";
import { GOAL_KEY, REPEAT_DDUDU_KEY, STATS_KEY } from "@/constants/query-key/query-key";
import type { RepeatDduduItemType } from "@/features/repeat-ddudu/repeat-ddudu.types";
import {
  createRepeatDdudu,
  deleteRepeatDdudu,
  editRepeatDdudu,
} from "@/service/repeat-ddudu/repeat-ddudu";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseRepeatDduduMutationProps {
  goalId: number;
}

function useRepeatDduduMutation({ goalId }: UseRepeatDduduMutationProps) {
  const queryClient = useQueryClient();
  const { createToast } = useToast();

  const handleMutationError = (error: unknown) => {
    const message =
      error instanceof Error ? error.message : "반복뚜두 처리 중 문제가 발생했습니다.";

    createToast(message, { type: "danger" });
  };

  const onSuccessMutation = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [GOAL_KEY.GOAL_DETAIL, goalId] }),
      queryClient.invalidateQueries({ queryKey: [STATS_KEY.GOAL_DETAIL_ACHIEVED, goalId] }),
      queryClient.invalidateQueries({ queryKey: [STATS_KEY.GOAL_DETAIL_POSTPONED, goalId] }),
    ]);
  };

  const createRepeatDduduMutation = useMutation({
    mutationKey: [REPEAT_DDUDU_KEY.REPEAT_CREATE, goalId],
    mutationFn: createRepeatDdudu,
    onSuccess: onSuccessMutation,
    onError: handleMutationError,
  });

  const editRepeatDduduMutation = useMutation({
    mutationKey: [REPEAT_DDUDU_KEY.REPEAT_EDIT, goalId],
    mutationFn: editRepeatDdudu,
    onSuccess: onSuccessMutation,
    onError: handleMutationError,
  });

  const deleteRepeatDduduMutation = useMutation({
    mutationKey: [REPEAT_DDUDU_KEY.REPEAT_DELETE, goalId],
    mutationFn: deleteRepeatDdudu,
    onSuccess: onSuccessMutation,
    onError: handleMutationError,
  });

  const handleCreateRepeatDdudu = (repeatDdudu: RepeatDduduItemType) => {
    const { id, tempId, ...repeatDduduWithoutIdentity } = repeatDdudu;

    createRepeatDduduMutation.mutate({
      requestRepeatDdudu: {
        ...repeatDduduWithoutIdentity,
        goalId,
        repeatDaysOfWeek: repeatDdudu.repeatDaysOfWeek?.map(normalizeDayOfWeekToKr),
      },
    });
  };

  const handleEditRepeatDdudu = (repeatDduduId: number, repeatDdudu: RepeatDduduItemType) => {
    const { id, tempId, ...repeatDduduWithoutIdentity } = repeatDdudu;

    editRepeatDduduMutation.mutate({
      repeatDduduId,
      requestRepeatDdudu: {
        ...repeatDduduWithoutIdentity,
        repeatDaysOfWeek: repeatDdudu.repeatDaysOfWeek?.map(normalizeDayOfWeekToKr),
      },
    });
  };

  const handleDeleteRepeatDdudu = (repeatDduduId: number) => {
    deleteRepeatDduduMutation.mutate({ repeatDduduId });
  };

  return {
    handleCreateRepeatDdudu,
    handleEditRepeatDdudu,
    handleDeleteRepeatDdudu,
  };
}

export default useRepeatDduduMutation;
