import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useToast } from "@/components/toast/hooks";
import { HEX_COLOR_WITH_OPTIONAL_HASH_REGEX } from "@/constants";
import { FEED_KEY, GOAL_KEY } from "@/constants/query-key/query-key";
import { deleteGoal, editGoal, terminateGoal } from "@/service/goal/goal";
import type { GoalEditRequestType } from "@/types/request/goal/goal";
import type { GoalPrivacyType } from "@/types/response/goal/goal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "expo-router";

export interface GoalEditFormValues {
  title: string;
  color: string;
  privacyType?: GoalPrivacyType;
}

interface UseGoalEditMutationProps {
  goalId: number;
  defaultTitle: string;
  pickedColor: string;
  privacyType: GoalPrivacyType;
  redirectOnSuccess?: boolean;
  invalidateFeedOnSuccess?: boolean;
  onMutationSuccess?: () => void;
}

const normalizeColorToHex6 = (color: string) => color.replace(/^#/, "").toUpperCase();

function useGoalEditMutation({
  goalId,
  defaultTitle,
  pickedColor,
  privacyType,
  redirectOnSuccess = true,
  invalidateFeedOnSuccess = false,
  onMutationSuccess,
}: UseGoalEditMutationProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { createToast } = useToast();

  const methods = useForm<GoalEditFormValues>({
    defaultValues: {
      title: defaultTitle,
      color: pickedColor,
      privacyType,
    },
  });

  const onErrorMutation = (error: unknown, defaultMessage: string) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    createToast(message, { type: "danger" });
  };

  const invalidateFeedQueries = async () => {
    if (!invalidateFeedOnSuccess) {
      return;
    }

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.DAILY_LIST] }),
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE] }),
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.MONTHLY_Todos] }),
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.WEEKLY_Todos] }),
    ]);
  };

  const handleMutationSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: [GOAL_KEY.GOAL_LIST] });
    await invalidateFeedQueries();

    if (redirectOnSuccess) {
      router.replace("/goal");
      return;
    }

    onMutationSuccess?.();
  };

  const editGoalMutation = useMutation({
    mutationKey: [GOAL_KEY.GOAL_EDIT, goalId],
    mutationFn: editGoal,
    onSuccess: handleMutationSuccess,
    onError: (error) => onErrorMutation(error, "목표 수정에 실패했습니다."),
  });

  const terminateGoalMutation = useMutation({
    mutationKey: [GOAL_KEY.GOAL_STATUS, goalId],
    mutationFn: terminateGoal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [GOAL_KEY.GOAL_LIST] });
      await queryClient.invalidateQueries({ queryKey: [GOAL_KEY.GOAL_DETAIL, goalId] });
      await invalidateFeedQueries();
      createToast("목표를 종료했습니다.", { type: "safe" });
    },
    onError: (error) => onErrorMutation(error, "목표 종료에 실패했습니다."),
  });

  const deleteGoalMutation = useMutation({
    mutationKey: [GOAL_KEY.GOAL_DELETE, goalId],
    mutationFn: deleteGoal,
    onSuccess: handleMutationSuccess,
    onError: (error) => onErrorMutation(error, "목표 삭제에 실패했습니다."),
  });

  const handleUpdateColor = useCallback(
    (color: string) => {
      methods.setValue("color", color);
    },
    [methods],
  );

  const handleSubmitGoalEdit: SubmitHandler<GoalEditFormValues> = (values) => {
    if (!HEX_COLOR_WITH_OPTIONAL_HASH_REGEX.test(values.color)) {
      createToast("색상은 #을 제외한 6자리 HEX 값이어야 합니다.", { type: "danger" });
      return;
    }

    const requestGoal: GoalEditRequestType = {
      name: values.title,
      color: normalizeColorToHex6(values.color),
      privacyType: values.privacyType ?? "PUBLIC",
    };

    editGoalMutation.mutate({ goalId, requestGoal });
  };

  const handleTerminateGoal = () => {
    terminateGoalMutation.mutate({ goalId, requestGoal: { status: "DONE" } });
  };

  const handleDeleteGoal = () => {
    deleteGoalMutation.mutate({ goalId });
  };

  return {
    methods,
    handleUpdateColor,
    handleSubmitGoalEdit,
    handleTerminateGoal,
    handleDeleteGoal,
    isEditPending: editGoalMutation.isPending,
    isTerminatePending: terminateGoalMutation.isPending,
    isDeletePending: deleteGoalMutation.isPending,
  };
}

export default useGoalEditMutation;
