import { useCallback } from "react";
import { DateData } from "react-native-calendars";

import { FEED_KEY } from "@/constants/query-key/query-key";
import { useMe } from "@/features/user";
import { getMonthlyTodos } from "@/service/feed/feed";
import { useAuthStore } from "@/stores";
import type { MonthlyWeeklyTodoType } from "@/types/response/feed/feed";
import { useQueryClient } from "@tanstack/react-query";

function useGoalsTodoMutation() {
  const queryClient = useQueryClient();
  const isGuestSession = useAuthStore((state) => state.sessionType === "guest");
  const { data: user } = useMe({ readOnly: true });

  const MonthlyTodos = useCallback(
    async (yearMonth: string) => {
      if (!isGuestSession && !user?.id) {
        return [];
      }

      return await queryClient.fetchQuery<MonthlyWeeklyTodoType[]>({
        queryKey: [FEED_KEY.MONTHLY_Todos, yearMonth],
        queryFn: () => getMonthlyTodos({ userId: user?.id ?? 0, date: yearMonth }),
      });
    },
    [isGuestSession, queryClient, user?.id],
  );

  const handleMonthChange = useCallback(
    async (date: DateData) => {
      const newYearMonth = date.dateString.substring(0, 7);

      const newMonthlyTodos = await MonthlyTodos(newYearMonth);

      if (newMonthlyTodos) {
        queryClient.setQueryData([FEED_KEY.MONTHLY_Todos, newYearMonth], () => newMonthlyTodos);
      }
    },
    [MonthlyTodos, queryClient],
  );

  return {
    handleMonthChange,
  };
}

export default useGoalsTodoMutation;
