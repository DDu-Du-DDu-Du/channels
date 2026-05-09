import { ActivityIndicator, ScrollView, View, useWindowDimensions } from "react-native";

import { SpoqaText } from "@/components";
import StatsGoalChartCard, {
  StatsGoalChartItem,
} from "@/features/stats/components/stats-goal-chart-card/stats-goal-chart-card";
import StatsReportSection from "@/features/stats/components/stats-report-section/stats-report-section";
import { StatsReportResponseType, StatsSummaryResponseType } from "@/types/response/stats/stats";

interface StatsWideOverviewProps {
  report?: StatsReportResponseType;
  summary?: StatsSummaryResponseType;
  isReportLoading: boolean;
  isReportError: boolean;
  isSummaryLoading: boolean;
  isSummaryError: boolean;
}

interface StatsGoalSourceItem {
  goalId: number;
  goalName: string;
  goalColor: string;
}

interface StatsGoalChartConfig {
  key: string;
  title: string;
  unit: string;
  items: StatsGoalChartItem[];
}

const resolveGoalColor = (goalColor: string) =>
  goalColor.startsWith("#") ? goalColor : `#${goalColor}`;

const toChartItems = <T extends StatsGoalSourceItem>(
  list: T[] | undefined,
  valueKey: keyof T,
): StatsGoalChartItem[] => {
  if (!list) {
    return [];
  }

  return list.map((item) => ({
    goalId: item.goalId,
    goalName: item.goalName,
    value: Number(item[valueKey] ?? 0),
    color: resolveGoalColor(item.goalColor),
  }));
};

function StatsWideOverview({
  report,
  summary,
  isReportLoading,
  isReportError,
  isSummaryLoading,
  isSummaryError,
}: StatsWideOverviewProps) {
  const { width } = useWindowDimensions();
  const chartCardWidth = width >= 1100 ? "48.5%" : "100%";
  const charts: StatsGoalChartConfig[] = [
    {
      key: "creationCounts",
      title: "가장 많은 투두를 만든 목표",
      unit: "개",
      items: toChartItems(summary?.creationCounts, "count"),
    },
    {
      key: "achievements",
      title: "달성률이 높은 목표",
      unit: "%",
      items: toChartItems(summary?.achievements, "achievementRate"),
    },
    {
      key: "sustenances",
      title: "가장 오래 지속한 목표",
      unit: "일",
      items: toChartItems(summary?.sustenances, "sustenanceCount"),
    },
    {
      key: "postponements",
      title: "자주 미룬 목표",
      unit: "개",
      items: toChartItems(summary?.postponements, "postponementCount"),
    },
    {
      key: "reattainments",
      title: "재달성률",
      unit: "%",
      items: toChartItems(summary?.reattainments, "reattainmentRate"),
    },
  ];

  return (
    <ScrollView
      className="flex-1 px-[2.4rem] pt-[2rem]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <StatsReportSection
        report={report}
        isLoading={isReportLoading}
        isError={isReportError}
      />

      <View className="mt-[2.4rem] border-t border-role-border-default pt-[2rem] dark:border-role-dark-border-default">
        <SpoqaText
          weight="bold"
          className="text-size20 text-role-text-primary dark:text-role-dark-text-primary"
        >
          목표 통계
        </SpoqaText>
        <SpoqaText className="mt-[0.6rem] text-size15 text-role-text-secondary dark:text-role-dark-text-secondary">
          어떤 목표의 달성률이 가장 높을까요?
        </SpoqaText>

        {isSummaryLoading ? (
          <View className="mt-[1.4rem] items-center py-[2rem]">
            <ActivityIndicator size="small" />
          </View>
        ) : null}

        {isSummaryError && !isSummaryLoading ? (
          <SpoqaText className="mt-[1.4rem] text-size14 text-role-status-error dark:text-role-dark-status-error">
            목표 통계를 불러오지 못했어요.
          </SpoqaText>
        ) : null}

        {!isSummaryLoading && !isSummaryError ? (
          <View className="mt-[1.8rem] flex-row flex-wrap justify-between">
            {charts.map((chart) => (
              <View
                key={chart.key}
                style={{ width: chartCardWidth }}
              >
                <StatsGoalChartCard
                  title={chart.title}
                  unit={chart.unit}
                  items={chart.items}
                />
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

export default StatsWideOverview;
