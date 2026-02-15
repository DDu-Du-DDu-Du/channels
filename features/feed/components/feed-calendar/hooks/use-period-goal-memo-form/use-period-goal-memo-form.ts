import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { PeriodType } from "@/components/period-goal-memo/period-goal-memo";
import { RequestPeriodGoalMemo } from "@/types/request/feed/feed";
import { GoalMemoType } from "@/types/response/feed/feed";

import useGoalsDDuDuMutation from "../use-goals-ddudu-mutation/use-goals-ddudu-mutation";

interface PeriodGoalMemoFormInfo {
  contents: string;
}

interface UsePeriodGoalMemoFormProps {
  date: string;
  type: PeriodType;
  periodGoalMemo?: GoalMemoType;
}

function usePeriodGoalMemoForm({ date, type, periodGoalMemo }: UsePeriodGoalMemoFormProps) {
  const methods = useForm<PeriodGoalMemoFormInfo>({
    defaultValues: { contents: periodGoalMemo?.contents ?? "" },
  });

  const { createGoalMemoMutation, editGoalMemoMutation } = useGoalsDDuDuMutation({
    date,
  });

  useEffect(() => {
    methods.reset({ contents: periodGoalMemo?.contents ?? "" });
  }, [methods, periodGoalMemo?.contents]);

  const onValid: SubmitHandler<PeriodGoalMemoFormInfo> = ({ contents }) => {
    if (!periodGoalMemo || !periodGoalMemo.id) {
      const periodGoals: RequestPeriodGoalMemo = {
        contents,
        type,
        planDate: date,
      };

      createGoalMemoMutation.mutate({ periodGoals });

      return;
    }

    editGoalMemoMutation.mutate({
      contents,
      periodGoalsId: periodGoalMemo.id,
    });
  };

  return { methods, onValid };
}

export default usePeriodGoalMemoForm;
