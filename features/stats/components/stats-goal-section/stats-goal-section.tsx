import { useEffect, useRef } from "react";
import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { GoalSelectSheet } from "@/features/goal";
import StatsGoalChartCard, {
  StatsGoalChartItem,
} from "@/features/stats/components/stats-goal-chart-card/stats-goal-chart-card";
import { useToggle } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ArrowRightIcon } from "@/icons";
import { StatsSummaryResponseType } from "@/types/response/stats/stats";

import { useRouter } from "expo-router";

interface StatsGoalSectionProps {
  yearMonth: string;
  openGoalSheetOnMount?: boolean;
  summary?: StatsSummaryResponseType;
  isLoading: boolean;
  isError: boolean;
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

function StatsGoalSection({
  yearMonth,
  openGoalSheetOnMount = false,
  summary,
  isLoading,
  isError,
}: StatsGoalSectionProps) {
  const router = useRouter();
  const iconStroke = useThemeColorToken("ui.icon.muted");
  const hasConsumedOpenParamRef = useRef(false);
  const {
    isToggle: isGoalSheetOpen,
    handleToggleOn: handleGoalSheetOpen,
    handleToggleOff: handleGoalSheetClose,
  } = useToggle();

  useEffect(() => {
    if (!openGoalSheetOnMount || hasConsumedOpenParamRef.current) {
      return;
    }

    hasConsumedOpenParamRef.current = true;
    handleGoalSheetOpen();
    router.replace({
      pathname: "/stats",
      params: { yearMonth },
    });
  }, [handleGoalSheetOpen, openGoalSheetOnMount, router, yearMonth]);

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

  const handlePressGoalDetail = () => {
    handleGoalSheetOpen();
  };

  const handlePressAdd = () => {
    router.push({
      pathname: "/goal/create",
      params: {
        returnTo: "/stats",
        openGoalSheet: "1",
        yearMonth,
      },
    });
  };

  const handlePressGoal = (goalId: number) => {
    router.push({
      pathname: "/stats/[id]",
      params: { id: goalId, yearMonth },
    });
  };

  return (
    <>
      <View className="mt-[2.4rem] border-t border-role-border-default dark:border-role-dark-border-default pt-[2rem]">
        <View className="mb-[2rem] flex-row items-center justify-between">
          <View className="flex-1 pr-[1rem]">
            <SpoqaText
              weight="bold"
              className="text-size20 text-role-text-primary dark:text-role-dark-text-primary"
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
              stroke={iconStroke}
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

      {isGoalSheetOpen && (
        <GoalSelectSheet
          onClose={handleGoalSheetClose}
          onPressGoal={(goal) => handlePressGoal(goal.id)}
          onPressAdd={handlePressAdd}
        />
      )}
    </>
  );
}

export default StatsGoalSection;
