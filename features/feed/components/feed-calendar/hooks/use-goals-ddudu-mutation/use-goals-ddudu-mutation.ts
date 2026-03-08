import { useCallback } from "react";
import { DateData } from "react-native-calendars";

import { FEED_KEY } from "@/constants/query-key/query-key";
import { useMe } from "@/features/user";
import { getMonthlyDDuDus } from "@/service/feed/feed";
import type { MonthlyWeeklyDDuDuType } from "@/types/response/feed/feed";
import { useQueryClient } from "@tanstack/react-query";

function useGoalsDDuDuMutation() {
  const queryClient = useQueryClient();
  const { data: user } = useMe({ readOnly: true });

  const MonthlyDDuDUs = useCallback(
    async (yearMonth: string) =>
      await queryClient.fetchQuery<MonthlyWeeklyDDuDuType[]>({
        queryKey: [FEED_KEY.MONTHLY_DDUDUS, yearMonth],
        queryFn: () => getMonthlyDDuDus({ userId: user.id, date: yearMonth }),
      }),
    [queryClient, user?.id],
  );

  const handleMonthChange = useCallback(
    async (date: DateData) => {
      const newYearMonth = date.dateString.substring(0, 7);

      const newMonthlyDDuDus = await MonthlyDDuDUs(newYearMonth);

      if (newMonthlyDDuDus) {
        queryClient.setQueryData([FEED_KEY.MONTHLY_DDUDUS, newYearMonth], () => newMonthlyDDuDus);
      }
    },
    [MonthlyDDuDUs, queryClient],
  );

  return {
    handleMonthChange,
  };
}

export default useGoalsDDuDuMutation;
