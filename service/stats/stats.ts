import { fetchApi } from "@/api";
import { STATS } from "@/constants/end-points";
import { StatsYearMonthRequest } from "@/types/request/stats/stats";
import { StatsReportResponseType, StatsSummaryResponseType } from "@/types/response/stats/stats";

export const getStatsReport = async ({
  yearMonth,
}: StatsYearMonthRequest): Promise<StatsReportResponseType> => {
  const response = await fetchApi(
    `${STATS.REPORT}?yearMonth=${yearMonth}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    },
    true,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getStatsSummary = async ({
  yearMonth,
}: StatsYearMonthRequest): Promise<StatsSummaryResponseType> => {
  const response = await fetchApi(
    `${STATS.SUMMARY}?yearMonth=${yearMonth}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    },
    true,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
