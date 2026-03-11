import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import StatsGoalChartCard, {
  StatsGoalChartItem,
} from "@/features/stats/components/stats-goal-chart-card/stats-goal-chart-card";
import { ArrowRightIcon } from "@/icons";
import { StatsSummaryResponseType } from "@/types/response/stats/stats";

import { useRouter } from "expo-router";

interface StatsGoalSectionProps {
  yearMonth: string;
  summary?: StatsSummaryResponseType;
  isLoading: boolean;
  isError: boolean;
}

interface StatsGoalSourceItem {
  goalId: number;
  goalName: string;
  goalColor?: string;
}

interface StatsGoalChartConfig {
  key: string;
  title: string;
  unit: string;
  items: StatsGoalChartItem[];
}

const FALLBACK_GOAL_COLORS = ["#5D7DB3", "#6FA57A", "#B08A4A", "#9A7BC7", "#BF6D6D", "#5C9FA3"];

// TODO(server): stats summary item에 goalColor(hex) 필드 추가 후 fallback 제거
const resolveGoalColor = (goalId: number, goalColor?: string) => {
  if (goalColor) {
    return goalColor.startsWith("#") ? goalColor : `#${goalColor}`;
  }

  return FALLBACK_GOAL_COLORS[goalId % FALLBACK_GOAL_COLORS.length];
};

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
    color: resolveGoalColor(item.goalId, item.goalColor),
  }));
};

function StatsGoalSection({ yearMonth, summary, isLoading, isError }: StatsGoalSectionProps) {
  const router = useRouter();

  const charts: StatsGoalChartConfig[] = [
    {
      key: "creationCounts",
      title: "가장 많은 뚜두를 만든 목표",
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

  const handlePressGoalDetail = () => {
    router.push({
      pathname: "/stats/select",
      params: { yearMonth },
    });
  };

  return (
    <View className="mt-[2.4rem] border-t border-role-border-default dark:border-role-dark-border-default pt-[2rem]">
      <View className="mb-[2rem] flex-row items-center justify-between">
        <View className="flex-1 pr-[1rem]">
          <SpoqaText
            weight="bold"
            className="text-size20 text-role-text-inverse dark:text-role-dark-text-inverse"
          >
            목표 통계
          </SpoqaText>
          <SpoqaText className="mt-[0.6rem] text-size15 text-role-text-secondary dark:text-role-dark-text-secondary">
            어떤 목표의 달성률이 가장 높을까요?
          </SpoqaText>
        </View>
        <Pressable
          className="flex-row items-center"
          hitSlop={8}
          onPress={handlePressGoalDetail}
        >
          <SpoqaText className="text-size14 text-role-text-secondary dark:text-role-dark-text-secondary">
            목표 상세통계
          </SpoqaText>
          <ArrowRightIcon
            size={14}
            stroke="#B6B6B6"
          />
        </Pressable>
      </View>

      {isLoading && (
        <SpoqaText className="text-size14 text-role-text-secondary dark:text-role-dark-text-secondary">
          불러오는 중...
        </SpoqaText>
      )}
      {isError && !isLoading && (
        <SpoqaText className="text-size14 text-role-status-error dark:text-role-dark-status-error">
          목표 통계를 불러오지 못했어요.
        </SpoqaText>
      )}

      {!isLoading &&
        !isError &&
        charts.map((chart) => (
          <StatsGoalChartCard
            key={chart.key}
            title={chart.title}
            unit={chart.unit}
            items={chart.items}
          />
        ))}
    </View>
  );
}

export default StatsGoalSection;
