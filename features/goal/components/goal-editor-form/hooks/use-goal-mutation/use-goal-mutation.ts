import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useToast } from "@/components/toast/hooks";
import { HEX_COLOR_WITH_OPTIONAL_HASH_REGEX, normalizeDayOfWeekToKr } from "@/constants";
import { GOAL_KEY } from "@/constants/query-key/query-key";
import type { RepeatTodoItemType } from "@/features/repeat-todo";
import { createGoal } from "@/service/goal/goal";
import type { GoalRequestType } from "@/types/request/goal/goal";
import type { GoalPrivacyType } from "@/types/response/goal/goal";
import { useMutation } from "@tanstack/react-query";

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
}

const normalizeColorToHex6 = (color: string) => color.replace(/^#/, "").toUpperCase();

function useGoalMutation({ defaultTitle, pickedColor, repeatTodos }: UseGoalMutationProps) {
  const router = useRouter();
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
    onSuccess: () => {
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
  };
}

export default useGoalMutation;
