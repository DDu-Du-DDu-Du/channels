import { fetchApi } from "@/api";
import { STATS } from "@/constants/end-points";
import { StatsGoalDetailRequest, StatsYearMonthRequest } from "@/types/request/stats/stats";
import {
  StatsAchievementType,
  StatsCreationCountType,
  StatsGoalAchievedDetailResponseType,
  StatsGoalDetailSummaryResponseType,
  StatsGoalPostponedDetailResponseType,
  StatsPostponementType,
  StatsReattainmentType,
  StatsReportResponseType,
  StatsSummaryResponseType,
  StatsSustenanceType,
} from "@/types/response/stats/stats";

interface MonthlyStatsSummaryItemResponse {
  goalId: number;
  goalName: string;
  goalColor: string;
  creationCount: number;
  achievementCount: number;
  postponedCount: number;
  sustainedCount: number;
  reattainedCount: number;
}

interface MonthlyStatsSummaryResponse {
  summaries: MonthlyStatsSummaryItemResponse[];
}

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

  const data = (await response.json()) as MonthlyStatsSummaryResponse;
  const summaries = data.summaries ?? [];
  const creationCounts: StatsCreationCountType[] = summaries.map((item) => ({
    goalId: item.goalId,
    goalName: item.goalName,
    goalColor: item.goalColor,
    count: item.creationCount,
  }));
  const achievements: StatsAchievementType[] = summaries.map((item) => ({
    goalId: item.goalId,
    goalName: item.goalName,
    goalColor: item.goalColor,
    achievementRate: item.achievementCount,
  }));
  const postponements: StatsPostponementType[] = summaries.map((item) => ({
    goalId: item.goalId,
    goalName: item.goalName,
    goalColor: item.goalColor,
    postponementCount: item.postponedCount,
  }));
  const sustenances: StatsSustenanceType[] = summaries.map((item) => ({
    goalId: item.goalId,
    goalName: item.goalName,
    goalColor: item.goalColor,
    sustenanceCount: item.sustainedCount,
  }));
  const reattainments: StatsReattainmentType[] = summaries.map((item) => ({
    goalId: item.goalId,
    goalName: item.goalName,
    goalColor: item.goalColor,
    reattainmentRate: item.reattainedCount,
  }));

  return {
    creationCounts,
    achievements,
    postponements,
    sustenances,
    reattainments,
  };
};

interface StatsGoalDetailSummaryRequest {
  goalId: number;
}

export const getGoalDetailSummaryStats = async ({
  goalId,
}: StatsGoalDetailSummaryRequest): Promise<StatsGoalDetailSummaryResponseType> => {
  const response = await fetchApi(`${STATS.GOAL_DETAIL}/${goalId}`, { method: "GET" }, true);

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
