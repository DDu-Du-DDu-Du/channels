import { fetchApi } from "@/api";
import { STATS } from "@/constants/end-points";
import { StatsGoalDetailRequest, StatsYearMonthRequest } from "@/types/request/stats/stats";
import {
  StatsGoalAchievedDetailResponseType,
  StatsGoalPostponedDetailResponseType,
  StatsReportResponseType,
  StatsSummaryResponseType,
} from "@/types/response/stats/stats";

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

export const getGoalAchievedDetailStats = async ({
  goalId,
  fromMonth,
  toMonth,
}: StatsGoalDetailRequest): Promise<StatsGoalAchievedDetailResponseType> => {
  const response = await fetchApi(
    `${STATS.GOAL_DETAIL_ACHIEVED}/${goalId}/achieved?fromMonth=${fromMonth}&toMonth=${toMonth}`,
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

export const getGoalPostponedDetailStats = async ({
  goalId,
  fromMonth,
  toMonth,
}: StatsGoalDetailRequest): Promise<StatsGoalPostponedDetailResponseType> => {
  const response = await fetchApi(
    `${STATS.GOAL_DETAIL_POSTPONED}/${goalId}/postponed?fromMonth=${fromMonth}&toMonth=${toMonth}`,
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
