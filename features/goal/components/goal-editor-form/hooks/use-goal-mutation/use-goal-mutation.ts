import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useToast } from "@/components/toast/hooks";
import { HEX_COLOR_WITH_OPTIONAL_HASH_REGEX, normalizeDayOfWeekToKr } from "@/constants";
import { FEED_KEY, GOAL_KEY } from "@/constants/query-key/query-key";
import type { RepeatTodoItemType } from "@/features/repeat-todo";
import { createGoal } from "@/service/goal/goal";
import type { GoalRequestType } from "@/types/request/goal/goal";
import type { GoalPrivacyType, GoalType } from "@/types/response/goal/goal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "expo-router";

export interface GoalEditorFormValues {
  title: string;
  color: string;
  privacyType?: GoalPrivacyType;
  repeatTodos?: RepeatTodoItemType[];
}

interface UseGoalMutationProps {
  defaultTitle: string;
  pickedColor: string;
  repeatTodos: RepeatTodoItemType[];
  onSubmitSuccess?: () => void;
  successRedirect?: {
    pathname: "/feed" | "/stats";
    params?: {
      openGoalSheet?: string;
      yearMonth?: string;
    };
  };
}

const normalizeColorToHex6 = (color: string) => color.replace(/^#/, "").toUpperCase();

function useGoalMutation({
  defaultTitle,
  pickedColor,
  repeatTodos,
  onSubmitSuccess,
  successRedirect,
}: UseGoalMutationProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { createToast } = useToast();
  const methods = useForm<GoalEditorFormValues>({
    defaultValues: {
      title: defaultTitle,
      color: pickedColor,
      privacyType: "PUBLIC",
    },
  });

  const createGoalMutation = useMutation({
    mutationKey: [GOAL_KEY.GOAL_CREATE],
    mutationFn: createGoal,
    onSuccess: async (data, variables) => {
      const createdId =
        typeof data === "object" &&
        data !== null &&
        "id" in data &&
        typeof (data as { id?: unknown }).id === "number"
          ? (data as { id: number }).id
          : null;

      queryClient.setQueriesData<GoalType[]>({ queryKey: [GOAL_KEY.GOAL_LIST] }, (previous) => {
        if (!previous || !createdId) {
          return previous;
        }

        const hasCreatedGoal = previous.some((goal) => goal.id === createdId);
        if (hasCreatedGoal) {
          return previous;
        }

        const maxPriority = previous.reduce((max, goal) => Math.max(max, goal.priority), 0);
        const createdGoal: GoalType = {
          id: createdId,
          name: variables.requestGoal.name,
          color: variables.requestGoal.color,
          status: "IN_PROGRESS",
          priority: maxPriority + 1,
        };

        return [...previous, createdGoal];
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [GOAL_KEY.GOAL_LIST] }),
        queryClient.invalidateQueries({ queryKey: [FEED_KEY.DAILY_LIST] }),
        queryClient.invalidateQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE] }),
        queryClient.invalidateQueries({ queryKey: [FEED_KEY.MONTHLY_Todos] }),
        queryClient.invalidateQueries({ queryKey: [FEED_KEY.WEEKLY_Todos] }),
      ]);
      methods.reset({
        title: defaultTitle,
        color: pickedColor,
        privacyType: "PUBLIC",
      });
      onSubmitSuccess?.();
      if (successRedirect) {
        router.replace(successRedirect);
        return;
      }

      router.replace("/goal");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "목표 생성에 실패했습니다.";

      createToast(message, { type: "danger" });
    },
  });

  const handleUpdateColor = useCallback(
    (color: string) => {
      methods.setValue("color", color);
    },
    [methods],
  );

  const handleSubmitGoal: SubmitHandler<GoalEditorFormValues> = (values) => {
    if (!HEX_COLOR_WITH_OPTIONAL_HASH_REGEX.test(values.color)) {
      createToast("색상은 #을 제외한 6자리 HEX 값이어야 합니다.", { type: "danger" });
      return;
    }

    const requestGoal: GoalRequestType = {
      name: values.title,
      color: normalizeColorToHex6(values.color),
      privacyType: values.privacyType ?? "PUBLIC",
      repeatTodos: repeatTodos.map((repeatTodo) => {
        const { id, tempId, ...repeatTodoWithoutIdentity } = repeatTodo;

        return {
          ...repeatTodoWithoutIdentity,
          repeatDaysOfWeek: repeatTodo.repeatDaysOfWeek?.map(normalizeDayOfWeekToKr),
        };
      }),
    };

    createGoalMutation.mutate({
      requestGoal,
    });
  };

  return {
    methods,
    handleUpdateColor,
    handleSubmitGoal,
    isPending: createGoalMutation.isPending,
  };
}

export default useGoalMutation;
