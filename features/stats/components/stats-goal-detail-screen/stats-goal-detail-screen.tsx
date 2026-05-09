import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { SpoqaText, YearMonthPickerSheet } from "@/components";
import { GOAL_KEY, STATS_KEY } from "@/constants/query-key/query-key";
import { RepeatTodoItemType, mapRepeatTodoResponseToItem } from "@/features/repeat-todo";
import {
  CalendarStatsSection,
  DayOfWeekStatsSection,
  GoalOverallStatsSection,
  MonthOverviewSection,
  MonthSelectionSection,
  RepeatTodostatsSection,
} from "@/features/stats/components/stats-goal-detail-screen/components";
import { useGoalDetailMonthRange, useGoalDetailStatsQuery } from "@/features/stats/hooks";
import { getGoalDetail } from "@/service/goal/goal";
import { getGoalDetailSummaryStats } from "@/service/stats/stats";
import { GoalDetailType } from "@/types/response/goal/goal";
import type { RepeatTodosType } from "@/types/response/repeat-todo/repeat-todo";
import { StatsGoalDetailSummaryResponseType } from "@/types/response/stats/stats";
import { useQuery } from "@tanstack/react-query";

import { useLocalSearchParams } from "expo-router";

const toSingleParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const FALLBACK_GOAL_COLOR = "#7A7A7A";

const formatDateTimeToKoreanDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return `${parsed.getFullYear()}. ${parsed.getMonth() + 1}. ${parsed.getDate()}`;
};

export interface StatsGoalDetailScreenProps {
  goalId?: number;
  initialYearMonth?: string;
  isEmbeddedWide?: boolean;
  onGoalNameChange?: (goalName: string) => void;
}

function StatsGoalDetailScreen({
  goalId: goalIdProp,
  initialYearMonth: initialYearMonthProp,
  isEmbeddedWide = false,
  onGoalNameChange,
}: StatsGoalDetailScreenProps) {
  const params = useLocalSearchParams<{ id?: string | string[]; yearMonth?: string | string[] }>();
  const goalId = goalIdProp ?? Number(toSingleParam(params.id) ?? "0");
  const initialYearMonth = initialYearMonthProp ?? toSingleParam(params.yearMonth);

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const {
    isRangeEnabled,
    singleMonth,
    fromMonth,
    toMonth,
    fromMonthText,
    toMonthText,
    inputLabel,
    suffixLabel,
    handleChangeSingleMonth,
    handleChangeFromMonth,
    handleChangeToMonth,
    handleToggleRange,
  } = useGoalDetailMonthRange({ initialYearMonth });

  const goalDetailQuery = useQuery<GoalDetailType>({
    queryKey: [GOAL_KEY.GOAL_DETAIL, goalId],
    queryFn: () => getGoalDetail({ goalId }),
    enabled: goalId > 0,
  });
  const goalSummaryQuery = useQuery<StatsGoalDetailSummaryResponseType>({
    queryKey: [STATS_KEY.GOAL_DETAIL_SUMMARY, goalId],
    queryFn: () => getGoalDetailSummaryStats({ goalId }),
    enabled: goalId > 0,
  });

  // We intentionally do not sync picker changes to router query params.
  // Query keys (fromMonth/toMonth) drive data refresh without route churn.
  const { achievedQuery, postponedQuery, isLoading, isError } = useGoalDetailStatsQuery({
    goalId,
    fromMonth: fromMonthText,
    toMonth: toMonthText,
  });

  const repeatTodoItems = useMemo<RepeatTodoItemType[]>(
    () =>
      (goalDetailQuery.data?.repeatTodos ?? goalDetailQuery.data?.repeatTodos ?? [])
        .filter((item): item is RepeatTodosType => Boolean(item && typeof item === "object"))
        .map(mapRepeatTodoResponseToItem),
    [goalDetailQuery.data?.repeatTodos],
  );

  const goalName = goalDetailQuery.data?.name ?? "Goal";
  const goalColorRaw =
    achievedQuery.data?.goalColor ?? postponedQuery.data?.goalColor ?? goalDetailQuery.data?.color;
  const goalColor = goalColorRaw
    ? goalColorRaw.startsWith("#")
      ? goalColorRaw
      : `#${goalColorRaw}`
    : FALLBACK_GOAL_COLOR;

  useEffect(() => {
    onGoalNameChange?.(goalName);
  }, [goalName, onGoalNameChange]);

  if (goalId <= 0) {
    return (
      <View className="flex-1 items-center justify-center px-[2.4rem]">
        <SpoqaText className="text-size14 text-role-text-secondary dark:text-role-dark-text-secondary">
          목표를 선택해 주세요.
        </SpoqaText>
      </View>
    );
  }

  return (
    <View
      className={`flex-1 ${isEmbeddedWide ? "px-[2.4rem] pt-[0.8rem]" : "px-[2.4rem] pt-[1.2rem]"}`}
    >
      <ScrollView
        className="mt-[0.6rem]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isEmbeddedWide ? 32 : 24 }}
      >
        <GoalOverallStatsSection
          createdAt={formatDateTimeToKoreanDate(goalSummaryQuery.data?.createdAt)}
          createdTodoCount={goalSummaryQuery.data?.totalCount ?? 0}
          completionRate={goalSummaryQuery.data?.completeRate ?? 0}
        />

        <MonthSelectionSection
          inputLabel={inputLabel}
          suffixLabel={suffixLabel}
          isRangeEnabled={isRangeEnabled}
          handlePressTitle={() => setIsPickerOpen(true)}
          handleToggleRange={() => handleToggleRange(!isRangeEnabled)}
        />

        {isLoading ? (
          <View className="mt-[1.6rem] items-center py-[2rem]">
            <ActivityIndicator size="small" />
          </View>
        ) : null}

        {isError ? (
          <SpoqaText className="mt-[1.6rem] text-size14 text-role-status-error dark:text-role-dark-status-error">
            통계 데이터를 불러오지 못했어요.
          </SpoqaText>
        ) : null}

        {!isLoading && !isError ? (
          <>
            <MonthOverviewSection
              achievedOverview={achievedQuery.data?.overview}
              postponedOverview={postponedQuery.data?.overview}
              goalColor={goalColor}
            />

            <DayOfWeekStatsSection
              achievedDayOfWeekStats={achievedQuery.data?.dayOfWeekStats}
              postponedDayOfWeekStats={postponedQuery.data?.dayOfWeekStats}
              goalColor={goalColor}
            />

            <RepeatTodostatsSection
              goalId={goalId}
              repeatTodostats={achievedQuery.data?.repeatTodoStats}
              repeatTodoItems={repeatTodoItems}
              goalColor={goalColor}
            />

            <CalendarStatsSection
              fromMonth={fromMonthText}
              achievedCalendarStats={achievedQuery.data?.calendarStats}
              postponedCalendarStats={postponedQuery.data?.calendarStats}
            />
          </>
        ) : null}
      </ScrollView>

      <YearMonthPickerSheet
        open={isPickerOpen}
        isRangeEnabled={isRangeEnabled}
        singleValue={singleMonth}
        fromValue={fromMonth}
        toValue={toMonth}
        onChangeSingle={handleChangeSingleMonth}
        onChangeFrom={handleChangeFromMonth}
        onChangeTo={handleChangeToMonth}
        onClose={() => setIsPickerOpen(false)}
      />
    </View>
  );
}

export default StatsGoalDetailScreen;
