import { STATS_KEY } from "@/constants/query-key/query-key";
import { getGoalAchievedDetailStats, getGoalPostponedDetailStats } from "@/service/stats/stats";
import { useAuthStore } from "@/stores";
import {
  StatsGoalAchievedDetailResponseType,
  StatsGoalPostponedDetailResponseType,
} from "@/types/response/stats/stats";
import { useQuery } from "@tanstack/react-query";

interface UseGoalDetailStatsQueryParams {
  goalId: number;
  fromMonth: string;
  toMonth: string;
}

function useGoalDetailStatsQuery({ goalId, fromMonth, toMonth }: UseGoalDetailStatsQueryParams) {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const hasTokens = useAuthStore((state) => !!state.accessToken && !!state.refreshToken);

  const isEnabled = hasHydrated && hasTokens && Number.isFinite(goalId) && goalId > 0;

  const achievedQuery = useQuery<StatsGoalAchievedDetailResponseType>({
    queryKey: [STATS_KEY.GOAL_DETAIL_ACHIEVED, goalId, fromMonth, toMonth],
    queryFn: () =>
      getGoalAchievedDetailStats({
        goalId,
        fromMonth,
        toMonth,
      }),
    enabled: isEnabled,
  });

  const postponedQuery = useQuery<StatsGoalPostponedDetailResponseType>({
    queryKey: [STATS_KEY.GOAL_DETAIL_POSTPONED, goalId, fromMonth, toMonth],
    queryFn: () =>
      getGoalPostponedDetailStats({
        goalId,
        fromMonth,
        toMonth,
      }),
    enabled: isEnabled,
  });

  return {
    achievedQuery,
    postponedQuery,
    isLoading: achievedQuery.isLoading || postponedQuery.isLoading,
    isError: achievedQuery.isError || postponedQuery.isError,
  };
}

export default useGoalDetailStatsQuery;
