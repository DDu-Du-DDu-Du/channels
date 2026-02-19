import { View } from "react-native";

import { SpoqaText } from "@/components";
import StatsReportCard from "@/features/stats/components/stats-report-card/stats-report-card";
import { StatsReportItemType, StatsReportResponseType } from "@/types/response/stats/stats";

type ReportMetricType = "count" | "rate" | "day";

interface ReportMetricConfig {
  key: keyof Pick<
    StatsReportItemType,
    "totalCount" | "achievementRate" | "sustenanceCount" | "postponementCount" | "reattainmentRate"
  >;
  title: string;
  type: ReportMetricType;
}

const REPORT_METRICS: ReportMetricConfig[] = [
  { key: "totalCount", title: "생성한 투두", type: "count" },
  { key: "achievementRate", title: "달성률", type: "rate" },
  { key: "sustenanceCount", title: "스트릭", type: "day" },
  { key: "postponementCount", title: "미룬 투두", type: "count" },
  { key: "reattainmentRate", title: "재달성률", type: "rate" },
];

const formatNumber = (value: number) => {
  if (Number.isInteger(value)) {
    return `${value}`;
  }

  return value.toFixed(1);
};

const unitByType: Record<ReportMetricType, string> = {
  count: "개",
  rate: "%",
  day: "일",
};

const getMetricValue = (item: StatsReportItemType | undefined, key: ReportMetricConfig["key"]) => {
  return item?.[key] ?? 0;
};

const getDeltaTone = (delta: number): "increase" | "decrease" | "neutral" => {
  if (delta > 0) {
    return "increase";
  }

  if (delta < 0) {
    return "decrease";
  }

  return "neutral";
};

const formatValueLabel = (value: number, type: ReportMetricType) => {
  return `${formatNumber(value)}${unitByType[type]}`;
};

const formatDeltaLabel = (delta: number, type: ReportMetricType) => {
  if (delta === 0) {
    return "-";
  }

  const sign = delta > 0 ? "+" : "-";
  return `${sign} ${formatNumber(Math.abs(delta))}${unitByType[type]}`;
};

interface StatsReportSectionProps {
  report?: StatsReportResponseType;
  isLoading: boolean;
  isError: boolean;
}

function StatsReportSection({ report, isLoading, isError }: StatsReportSectionProps) {
  const firstRowMetrics = REPORT_METRICS.slice(0, 3);
  const secondRowMetrics = REPORT_METRICS.slice(3);

  return (
    <View className="border-t border-sub_gray_200 pt-[2rem]">
      <SpoqaText
        weight="bold"
        className="text-size20 text-white_100"
      >
        요약 리포트
      </SpoqaText>
      <SpoqaText className="mt-[0.6rem] text-size15 text-example_gray_900">
        저번 달 대비 이번 달의 성과예요
      </SpoqaText>
      {isLoading && (
        <View className="mt-[1.4rem]">
          <SpoqaText className="text-size14 text-example_gray_900">불러오는 중...</SpoqaText>
        </View>
      )}
      {isError && !isLoading && (
        <View className="mt-[1.4rem]">
          <SpoqaText className="text-size14 text-example_red_500">
            요약 리포트를 불러오지 못했어요.
          </SpoqaText>
        </View>
      )}
      {!isLoading && !isError && (
        <View className="mt-[1.8rem]">
          <View className="flex-row items-stretch justify-between">
            {firstRowMetrics.map((metric) => {
              const currentValue = getMetricValue(report?.thisMonth, metric.key);
              const lastValue = getMetricValue(report?.lastMonth, metric.key);
              const delta = currentValue - lastValue;

              return (
                <View
                  key={metric.key}
                  className="w-[31%]"
                >
                  <StatsReportCard
                    title={metric.title}
                    valueLabel={formatValueLabel(currentValue, metric.type)}
                    deltaLabel={formatDeltaLabel(delta, metric.type)}
                    deltaTone={getDeltaTone(delta)}
                  />
                </View>
              );
            })}
          </View>

          <View className="mt-[1.2rem] flex-row items-stretch justify-center gap-[1.2rem]">
            {secondRowMetrics.map((metric) => {
              const currentValue = getMetricValue(report?.thisMonth, metric.key);
              const lastValue = getMetricValue(report?.lastMonth, metric.key);
              const delta = currentValue - lastValue;

              return (
                <View
                  key={metric.key}
                  className="w-[31%]"
                >
                  <StatsReportCard
                    title={metric.title}
                    valueLabel={formatValueLabel(currentValue, metric.type)}
                    deltaLabel={formatDeltaLabel(delta, metric.type)}
                    deltaTone={getDeltaTone(delta)}
                  />
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

export default StatsReportSection;
