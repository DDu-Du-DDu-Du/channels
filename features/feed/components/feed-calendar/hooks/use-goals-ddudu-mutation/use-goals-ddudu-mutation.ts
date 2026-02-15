import { useCallback, useState } from "react";
import { DateData } from "react-native-calendars";

import { PeriodType } from "@/components/period-goal-memo/period-goal-memo";
import { FEED_KEY, QUERY_KEY } from "@/constants/query-key/query-key";
import { useMe } from "@/features/user";
import {
  fetchCreateGoals,
  fetchEditGoals,
  getGoals,
  getMonthlyDDuDus,
  getWeeklyDDuDus,
} from "@/service/feed/feed";
import type { GoalMemoType, MonthlyWeeklyDDuDuType } from "@/types/response/feed/feed";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseGoalsDDuDuMutationProps {
  type?: PeriodType;
  date: string;
  handleToggleOff?: () => void;
  onSelectDate?: (date: string) => void;
}

function useGoalsDDuDuMutation({
  type,
  date,
  handleToggleOff,
  onSelectDate,
}: UseGoalsDDuDuMutationProps) {
  const queryClient = useQueryClient();
  const goalMemoMutationKey =
    type === "MONTH" ? FEED_KEY.MONTHLY_GOAL_MEMO : FEED_KEY.WEEKLY_GOAL_MEMO;
  const { data: user } = useMe({ readOnly: true });
  const [yearMonth, setYearMonth] = useState(date.substring(0, 7));

  const MonthlyGoalMemo = useCallback(
    async (date: string, yearMonth: string) =>
      await queryClient.fetchQuery<GoalMemoType>({
        queryKey: [FEED_KEY.MONTHLY_GOAL_MEMO, yearMonth],
        queryFn: () => getGoals({ type: "MONTH", date }),
      }),
    [queryClient],
  );

  const WeeklyGoalMemo = useCallback(
    async (date: string) =>
      await queryClient.fetchQuery<GoalMemoType>({
        queryKey: [FEED_KEY.WEEKLY_GOAL_MEMO, date],
        queryFn: () => getGoals({ type: "WEEK", date }),
      }),
    [queryClient],
  );

  const onMonthlyGoalsSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: [FEED_KEY.MONTHLY_GOAL_MEMO, yearMonth],
    });

    const updateMonthlyGoalMemo = await MonthlyGoalMemo(date, yearMonth);

    if (updateMonthlyGoalMemo) {
      queryClient.setQueryData(
        [FEED_KEY.MONTHLY_GOAL_MEMO, yearMonth],
        () => updateMonthlyGoalMemo,
      );
    }

    handleToggleOff?.();
  }, [queryClient, yearMonth, MonthlyGoalMemo, date, handleToggleOff]);

  const createGoalMemoMutation = useMutation({
    mutationKey: [goalMemoMutationKey, QUERY_KEY.CREATE],
    mutationFn: fetchCreateGoals,
    onSuccess: onMonthlyGoalsSuccess,
  });

  const editGoalMemoMutation = useMutation({
    mutationKey: [goalMemoMutationKey, QUERY_KEY.EDIT],
    mutationFn: fetchEditGoals,
    onSuccess: onMonthlyGoalsSuccess,
  });

  const MonthlyDDuDUs = useCallback(
    async (yearMonth: string) =>
      await queryClient.fetchQuery<MonthlyWeeklyDDuDuType[]>({
        queryKey: [FEED_KEY.MONTHLY_DDUDUS, yearMonth],
        queryFn: () => getMonthlyDDuDus({ userId: user.id, date: yearMonth }),
      }),
    [queryClient, user?.id],
  );

  const WeeklyDDuDus = useCallback(
    async (date: string) =>
      await queryClient.fetchQuery<MonthlyWeeklyDDuDuType[]>({
        queryKey: [FEED_KEY.WEEKLY_DDUDUS, date],
        queryFn: () => getWeeklyDDuDus({ userId: user?.id!, date }),
      }),
    [queryClient, user?.id],
  );

  const handleMonthChange = useCallback(
    async (date: DateData) => {
      const newYearMonth = date.dateString.substring(0, 7);

      setYearMonth(newYearMonth);

      const newMonthlyDDuDus = await MonthlyDDuDUs(newYearMonth);

      if (newMonthlyDDuDus) {
        queryClient.setQueryData([FEED_KEY.MONTHLY_DDUDUS, newYearMonth], () => newMonthlyDDuDus);
      }

      const newMonthlyGoalMemo = await MonthlyGoalMemo(date.dateString, newYearMonth);

      if (newMonthlyGoalMemo) {
        queryClient.setQueryData(
          [FEED_KEY.MONTHLY_GOAL_MEMO, newYearMonth],
          () => newMonthlyGoalMemo,
        );
      }
    },
    [MonthlyDDuDUs, MonthlyGoalMemo, queryClient],
  );

  const handleWeekChange = useCallback(
    async (date: string) => {
      onSelectDate?.(date);

      const newWeeklyDDuDus = await WeeklyDDuDus(date);

      if (newWeeklyDDuDus) {
        queryClient.setQueryData([FEED_KEY.WEEKLY_DDUDUS, date], () => newWeeklyDDuDus);
      }

      const newWeeklyGoalMemo = await WeeklyGoalMemo(date);

      if (newWeeklyGoalMemo) {
        queryClient.setQueryData([FEED_KEY.WEEKLY_GOAL_MEMO, date], () => newWeeklyGoalMemo);
      }
    },
    [WeeklyDDuDus, WeeklyGoalMemo, onSelectDate, queryClient],
  );

  return {
    createGoalMemoMutation,
    editGoalMemoMutation,
    handleMonthChange,
    handleWeekChange,
  };
}

export default useGoalsDDuDuMutation;
