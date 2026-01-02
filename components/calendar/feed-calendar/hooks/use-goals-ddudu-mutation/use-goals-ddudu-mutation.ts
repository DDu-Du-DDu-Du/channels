import { useCallback, useState } from "react";
import { DateData } from "react-native-calendars";

import { FEED_KEY, QUERY_KEY } from "@/constants/query-key/query-key";
import { useMe } from "@/features/user";
import { fetchCreateGoals, fetchEditGoals, getGoals, getMonthlyDDuDus } from "@/service/feed/feed";
import type { MonthlyGoalMemoType, MonthlyWeeklyDDuDuType } from "@/types/response/feed/feed";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseGoalsDDuDuMutationProps {
  date: string;
  handleToggleOff?: () => void;
}

function useGoalsDDuDuMutation({ date, handleToggleOff }: UseGoalsDDuDuMutationProps) {
  const queryClient = useQueryClient();
  const { data: user } = useMe({ readOnly: true });
  const [selectedDate, setSelectedDate] = useState(date);
  const [yearMonth, setYearMonth] = useState(date.substring(0, 7));

  const MonthlyGoalMemo = useCallback(
    async (date: string, yearMonth: string) =>
      await queryClient.fetchQuery<MonthlyGoalMemoType>({
        queryKey: [FEED_KEY.MONTHLY_GOAL_MEMO, yearMonth],
        queryFn: () => getGoals({ type: "MONTH", date }),
      }),
    [queryClient],
  );

  const onMonthlyGoalsSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: [FEED_KEY.MONTHLY_GOAL_MEMO, yearMonth],
    });

    const updateMonthlyGoalMemo = await MonthlyGoalMemo(selectedDate, yearMonth);

    if (updateMonthlyGoalMemo) {
      queryClient.setQueryData(
        [FEED_KEY.MONTHLY_GOAL_MEMO, yearMonth],
        () => updateMonthlyGoalMemo,
      );
    }

    handleToggleOff?.();
  }, [queryClient, yearMonth, MonthlyGoalMemo, selectedDate, handleToggleOff]);

  const createMonthlyGoalMemoMutation = useMutation({
    mutationKey: [FEED_KEY.MONTHLY_GOAL_MEMO, QUERY_KEY.CREATE],
    mutationFn: fetchCreateGoals,
    onSuccess: onMonthlyGoalsSuccess,
  });

  const editMonthlyGoalMemoMutation = useMutation({
    mutationKey: [FEED_KEY.MONTHLY_GOAL_MEMO, QUERY_KEY.EDIT],
    mutationFn: fetchEditGoals,
    onSuccess: onMonthlyGoalsSuccess,
  });

  const MonthlyDDuDUs = useCallback(
    async (yearMonth: string) =>
      await queryClient.fetchQuery<MonthlyWeeklyDDuDuType[]>({
        queryKey: [FEED_KEY.MONTHLY_DDUDUS, yearMonth],
        queryFn: () => getMonthlyDDuDus({ userId: user?.id!, date: yearMonth }),
      }),
    [queryClient, user?.id],
  );

  const handleMonthChange = useCallback(
    async (date: DateData) => {
      const newYearMonth = date.dateString.substring(0, 7);

      setSelectedDate(date.dateString);
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

  return {
    createMonthlyGoalMemoMutation,
    editMonthlyGoalMemoMutation,
    handleMonthChange,
  };
}

export default useGoalsDDuDuMutation;
