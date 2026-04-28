import { ScrollView } from "react-native";

import { useStatsMonth, useStatsQuery } from "@/features/stats/hooks";

import StatsGoalSection from "../stats-goal-section/stats-goal-section";
import StatsHeader from "../stats-header/stats-header";
import StatsReportSection from "../stats-report-section/stats-report-section";

function StatsScreen() {
  const { yearMonth, yearMonthLabel, handlePrevMonth, handleNextMonth } = useStatsMonth();
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
        summary={summaryQuery.data}
        isLoading={summaryQuery.isLoading}
        isError={summaryQuery.isError}
      />
    </ScrollView>
  );
}

export default StatsScreen;
