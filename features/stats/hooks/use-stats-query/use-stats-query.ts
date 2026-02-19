import { STATS_KEY } from "@/constants/query-key/query-key";
import { useMe } from "@/features/user";
import { getStatsReport, getStatsSummary } from "@/service/stats/stats";
import { useAuthStore } from "@/stores";
import { StatsReportResponseType, StatsSummaryResponseType } from "@/types/response/stats/stats";
import { useQuery } from "@tanstack/react-query";

interface UseStatsQueryParams {
  yearMonth: string;
}

function useStatsQuery({ yearMonth }: UseStatsQueryParams) {
  const hasTokens = useAuthStore((state) => state.accessToken && state.refreshToken);
  const { data: user } = useMe({ readOnly: true });
  const isSessionReady = !!hasTokens && !!user;

  const reportQuery = useQuery<StatsReportResponseType>({
    queryKey: [STATS_KEY.REPORT, user?.id, yearMonth],
    queryFn: () => getStatsReport({ yearMonth }),
    enabled: isSessionReady,
  });

  const summaryQuery = useQuery<StatsSummaryResponseType>({
    queryKey: [STATS_KEY.SUMMARY, user?.id, yearMonth],
    queryFn: () => getStatsSummary({ yearMonth }),
    enabled: isSessionReady,
  });

  return {
    reportQuery,
    summaryQuery,
    isLoading: reportQuery.isLoading || summaryQuery.isLoading,
    isError: reportQuery.isError || summaryQuery.isError,
  };
}

export default useStatsQuery;
