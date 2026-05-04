import { useEffect, useMemo, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";

import { WidePanelLayout } from "@/components";
import { GOAL_KEY } from "@/constants/query-key/query-key";
import { useStatsMonth, useStatsQuery } from "@/features/stats/hooks";
import { useMe } from "@/features/user";
import { getGoalList } from "@/service/goal/goal";
import { useAuthStore } from "@/stores";
import type { GoalType } from "@/types/response/goal/goal";
import { useQuery } from "@tanstack/react-query";

import StatsGoalDetailScreen from "../stats-goal-detail-screen/stats-goal-detail-screen";
import StatsGoalSection from "../stats-goal-section/stats-goal-section";
import StatsHeader from "../stats-header/stats-header";
import StatsReportSection from "../stats-report-section/stats-report-section";
import StatsWideControlPanel from "../stats-wide-control-panel";
import { StatsWideOverview } from "./components";

import { useLocalSearchParams, useRouter } from "expo-router";

const toSingleParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const toPositiveNumber = (value: string | number | undefined) => {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    return undefined;
  }

  return numberValue;
};

export interface StatsScreenProps {
  initialSelectedGoalId?: number;
}

function StatsScreen({ initialSelectedGoalId }: StatsScreenProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{
    goalId?: string | string[];
    openGoalSheet?: string | string[];
    yearMonth?: string | string[];
  }>();
  const initialYearMonth = toSingleParam(params.yearMonth);
  const initialGoalId = initialSelectedGoalId ?? toPositiveNumber(toSingleParam(params.goalId));
  const shouldOpenGoalSheet = toSingleParam(params.openGoalSheet) === "1";
  const { yearMonth, yearMonthLabel, handlePrevMonth, handleNextMonth } =
    useStatsMonth(initialYearMonth);
  const { reportQuery, summaryQuery } = useStatsQuery({ yearMonth });
  const [selectedGoalId, setSelectedGoalId] = useState<number | undefined>(() => initialGoalId);
  const isWideLayout = width > 768;
  const hasTokens = useAuthStore((state) => Boolean(state.accessToken && state.refreshToken));
  const isGuestSession = useAuthStore((state) => state.sessionType === "guest");
  const { data: user } = useMe({ readOnly: true });
  const isGoalListSessionReady = useMemo(
    () => isGuestSession || (!!hasTokens && !!user),
    [hasTokens, isGuestSession, user],
  );
  const goalListQuery = useQuery<GoalType[]>({
    queryKey: [GOAL_KEY.GOAL_LIST, user?.id],
    queryFn: () => {
      if (!isGuestSession && !user?.id) {
        return Promise.resolve([]);
      }

      return getGoalList({ userId: user?.id ?? 0 });
    },
    enabled: isWideLayout && isGoalListSessionReady,
  });
  const sortedGoals = useMemo(
    () =>
      [...(goalListQuery.data ?? [])].sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }

        return a.id - b.id;
      }),
    [goalListQuery.data],
  );

  useEffect(() => {
    const nextGoalId = toPositiveNumber(initialSelectedGoalId);

    if (nextGoalId) {
      setSelectedGoalId(nextGoalId);
    }
  }, [initialSelectedGoalId]);

  const handlePressOverview = () => {
    setSelectedGoalId(undefined);
  };

  const handlePressGoal = (goalId: number) => {
    setSelectedGoalId(goalId);
  };

  const handlePressAddGoal = () => {
    router.push({
      pathname: "/goal/create",
      params: {
        returnTo: "/stats",
        yearMonth,
      },
    });
  };

  const handlePressEditGoal = (goalId: number) => {
    router.push({
      pathname: "/goal/editor",
      params: {
        goalId,
        backHref: `/stats?yearMonth=${encodeURIComponent(yearMonth)}&goalId=${goalId}`,
      },
    });
  };

  if (isWideLayout) {
    const statsWideDetail = (
      <View className="min-w-0 flex-1 bg-role-surface-canvas dark:bg-role-dark-surface-canvas">
        {selectedGoalId ? (
          <StatsGoalDetailScreen
            key={`${selectedGoalId}-${yearMonth}`}
            goalId={selectedGoalId}
            initialYearMonth={yearMonth}
            isEmbeddedWide
          />
        ) : (
          <StatsWideOverview
            report={reportQuery.data}
            summary={summaryQuery.data}
            isReportLoading={reportQuery.isLoading}
            isReportError={reportQuery.isError}
            isSummaryLoading={summaryQuery.isLoading}
            isSummaryError={summaryQuery.isError}
          />
        )}
      </View>
    );

    return (
      <WidePanelLayout
        control={
          <StatsWideControlPanel
            yearMonthLabel={yearMonthLabel}
            goals={sortedGoals}
            selectedGoalId={selectedGoalId}
            isGoalsLoading={goalListQuery.isLoading}
            isGoalsError={goalListQuery.isError}
            handlePrevMonth={handlePrevMonth}
            handleNextMonth={handleNextMonth}
            handlePressOverview={handlePressOverview}
            handlePressGoal={handlePressGoal}
            handlePressEditGoal={handlePressEditGoal}
            handlePressAddGoal={handlePressAddGoal}
          />
        }
        detail={statsWideDetail}
        controlWidth="34%"
      />
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <StatsHeader
        yearMonthLabel={yearMonthLabel}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
      />

      <StatsReportSection
        report={reportQuery.data}
        isLoading={reportQuery.isLoading}
        isError={reportQuery.isError}
      />

      <StatsGoalSection
        yearMonth={yearMonth}
        openGoalSheetOnMount={shouldOpenGoalSheet}
        summary={summaryQuery.data}
        isLoading={summaryQuery.isLoading}
        isError={summaryQuery.isError}
      />
    </ScrollView>
  );
}

export default StatsScreen;
