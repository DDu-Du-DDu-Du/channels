import { ScrollView } from "react-native";

import { useStatsMonth, useStatsQuery } from "@/features/stats/hooks";

import StatsGoalSection from "../stats-goal-section/stats-goal-section";
import StatsHeader from "../stats-header/stats-header";
import StatsReportSection from "../stats-report-section/stats-report-section";

import { useLocalSearchParams } from "expo-router";

const toSingleParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

function StatsScreen() {
  const params = useLocalSearchParams<{
    openGoalSheet?: string | string[];
    yearMonth?: string | string[];
  }>();
  const initialYearMonth = toSingleParam(params.yearMonth);
  const shouldOpenGoalSheet = toSingleParam(params.openGoalSheet) === "1";
  const { yearMonth, yearMonthLabel, handlePrevMonth, handleNextMonth } =
    useStatsMonth(initialYearMonth);
  const { reportQuery, summaryQuery } = useStatsQuery({ yearMonth });

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
