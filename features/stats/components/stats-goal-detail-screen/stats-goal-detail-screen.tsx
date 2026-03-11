import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { SpoqaText, YearMonthPickerSheet } from "@/components";
import { GOAL_KEY } from "@/constants/query-key/query-key";
import { RepeatDduduItemType, mapRepeatDduduResponseToItem } from "@/features/repeat-ddudu";
import {
  CalendarStatsSection,
  DayOfWeekStatsSection,
  GoalDetailHeader,
  GoalOverallStatsSection,
  MonthOverviewSection,
  MonthSelectionSection,
  RepeatDduduStatsSection,
} from "@/features/stats/components/stats-goal-detail-screen/components";
import { useGoalDetailMonthRange, useGoalDetailStatsQuery } from "@/features/stats/hooks";
import { getGoalDetail } from "@/service/goal/goal";
import { GoalDetailType } from "@/types/response/goal/goal";
import type { RepeatDDuDusType } from "@/types/response/repeat-ddudu/repeat-ddudu";
import { useQuery } from "@tanstack/react-query";

import { useLocalSearchParams, useRouter } from "expo-router";

const toSingleParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const FALLBACK_GOAL_COLOR = "#7A7A7A";

function StatsGoalDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[]; yearMonth?: string | string[] }>();
  const goalId = Number(toSingleParam(params.id) ?? "0");
  const initialYearMonth = toSingleParam(params.yearMonth);

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

  // We intentionally do not sync picker changes to router query params.
  // Query keys (fromMonth/toMonth) drive data refresh without route churn.
  const { achievedQuery, postponedQuery, isLoading, isError } = useGoalDetailStatsQuery({
    goalId,
    fromMonth: fromMonthText,
    toMonth: toMonthText,
  });

  const repeatDduduItems = useMemo<RepeatDduduItemType[]>(
    () =>
      (goalDetailQuery.data?.repeatDdudus ?? [])
        .filter((item): item is RepeatDDuDusType => Boolean(item && typeof item === "object"))
        .map(mapRepeatDduduResponseToItem),
    [goalDetailQuery.data?.repeatDdudus],
  );

  const goalName = goalDetailQuery.data?.name ?? "Goal";
  // TODO(server): goalColor source should be integrated in detailed stats response.
  const goalColor = goalDetailQuery.data?.color
    ? `#${goalDetailQuery.data.color}`
    : FALLBACK_GOAL_COLOR;

  // TODO(server): replace with overall stats API response.
  const overallDummy = {
    createdAt: "2024. 4. 12",
    createdDduduCount: 49,
    completionRate: 80,
  };

  const handlePressBack = () => {
    router.back();
  };

  const handlePressEdit = () => {
    if (!goalId) {
      return;
    }

    router.push({
      pathname: "/goal/editor",
      params: { goalId },
    });
  };

  return (
    <View className="flex-1 px-[2.4rem] pt-[1.2rem]">
      <ScrollView
        className="mt-[0.6rem]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <GoalDetailHeader
          goalName={goalName}
          handlePressBack={handlePressBack}
          onPressEdit={handlePressEdit}
        />

        <GoalOverallStatsSection
          createdAt={overallDummy.createdAt}
          createdDduduCount={overallDummy.createdDduduCount}
          completionRate={overallDummy.completionRate}
        />

        <MonthSelectionSection
          inputLabel={inputLabel}
          suffixLabel={suffixLabel}
          isRangeEnabled={isRangeEnabled}
          handlePressTitle={() => setIsPickerOpen(true)}
          handleToggleRange={() => handleToggleRange(!isRangeEnabled)}
        />

        {isLoading ? (
          <SpoqaText className="mt-[1.6rem] text-size14 text-role-text-secondary dark:text-role-dark-text-secondary">
            불러오는 중...
          </SpoqaText>
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

            <RepeatDduduStatsSection
              goalId={goalId}
              repeatDduduStats={achievedQuery.data?.repeatDduduStats}
              repeatDduduItems={repeatDduduItems}
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
