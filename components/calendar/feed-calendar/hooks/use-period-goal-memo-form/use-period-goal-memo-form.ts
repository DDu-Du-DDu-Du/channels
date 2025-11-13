import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { PeriodType } from "@/components/period-goal-memo/period-goal-memo";
import { RequestPeriodGoalMemo } from "@/types/request/feed/feed";
import { MonthlyGoalMemoType } from "@/types/response/feed/feed";

import useGoalsDDuDuMutation from "../use-goals-ddudu-mutation/use-goals-ddudu-mutation";

interface PeriodGoalMemoFormInfo {
  contents: string;
}

interface UsePeriodGoalMemoFormProps {
  yearMonth: string;
  type: PeriodType;
  periodGoalMemo?: MonthlyGoalMemoType;
}

function usePeriodGoalMemoForm({ yearMonth, type, periodGoalMemo }: UsePeriodGoalMemoFormProps) {
  const methods = useForm<PeriodGoalMemoFormInfo>({
    defaultValues: { contents: periodGoalMemo?.contents ?? "" },
  });

  const { createMonthlyGoalMemoMutation, editMonthlyGoalMemoMutation } = useGoalsDDuDuMutation({
    date: yearMonth,
  });

  useEffect(() => {
    methods.reset({ contents: periodGoalMemo?.contents ?? "" });
  }, [methods, yearMonth, periodGoalMemo?.contents]);

  const onValid: SubmitHandler<PeriodGoalMemoFormInfo> = ({ contents }) => {
    if (!periodGoalMemo || !periodGoalMemo.id) {
      const periodGoals: RequestPeriodGoalMemo = {
        contents,
        type: type,
        planDate: yearMonth,
      };

      createMonthlyGoalMemoMutation.mutate({
        accessToken: "TODO", // TODO: add auth
        periodGoals,
      });

      return;
    }

    editMonthlyGoalMemoMutation.mutate({
      accessToken: "TODO", // TODO: add auth
      contents,
      periodGoalsId: periodGoalMemo.id,
    });
  };

  return { methods, onValid };
}

export default usePeriodGoalMemoForm;
