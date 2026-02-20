import { View } from "react-native";

import {
  StatsGoalAchievedOverviewType,
  StatsGoalPostponedOverviewType,
} from "@/types/response/stats/stats";

import MiniMetricCard from "../mini-metric-card/mini-metric-card";
import ProgressRingCard from "../progress-ring-card/progress-ring-card";

interface MonthOverviewSectionProps {
  achievedOverview?: StatsGoalAchievedOverviewType;
  postponedOverview?: StatsGoalPostponedOverviewType;
  goalColor: string;
}

const getSafeRate = (value: number | undefined) => {
  if (!value || Number.isNaN(value)) {
    return 0;
  }

  return value;
};

const getSafeCount = (value: number | undefined) => {
  if (!value || Number.isNaN(value)) {
    return 0;
  }

  return value;
};

const getMostAchievedTimeLabel = (value?: string) => {
  if (value === "AM") {
    return "오전";
  }

  if (value === "PM") {
    return "오후";
  }

  return "-";
};

function MonthOverviewSection({
  achievedOverview,
  postponedOverview,
  goalColor,
}: MonthOverviewSectionProps) {
  const achievementCount = getSafeCount(achievedOverview?.achievementCount);
  const totalCount = getSafeCount(achievedOverview?.totalCount);
  const achievementRate = getSafeRate(achievedOverview?.achievementRate);

  const postponedCount = getSafeCount(postponedOverview?.postponedCount);
  const reattainedCount = getSafeCount(postponedOverview?.reattainedCount);
  const postponementRate = getSafeRate(postponedOverview?.postponementRate);
  const reattainmentRate = getSafeRate(postponedOverview?.reattainmentRate);

  return (
    <View className="mt-[1.4rem]">
      <View className="flex-row justify-between">
        <View className="w-[60%]">
          <ProgressRingCard
            title="투두 달성률"
            percent={achievementRate}
            fractionText={`${achievementCount} / ${totalCount}`}
            color={goalColor}
            size={178}
            strokeWidth={11}
            sizeVariant="large"
            denominator={totalCount}
          />

          <View className="mt-[0.8rem] flex-row flex-wrap justify-between gap-y-[0.8rem]">
            <MiniMetricCard
              title="생성투두"
              value={`${totalCount}개`}
            />
            <MiniMetricCard
              title="투두시간"
              value={getMostAchievedTimeLabel(achievedOverview?.mostAchievedTime)}
            />
            <MiniMetricCard
              title="미룬투두"
              value={`${postponedCount}개`}
            />
            <MiniMetricCard
              title="재달성투두"
              value={`${reattainedCount}개`}
            />
          </View>
        </View>

        <View className="w-[38%] gap-[0.8rem]">
          <ProgressRingCard
            title="미루기율"
            percent={postponementRate}
            fractionText={`${postponedCount} / ${totalCount}`}
            color={goalColor}
            size={126}
            strokeWidth={9}
            sizeVariant="medium"
            denominator={totalCount}
          />

          <ProgressRingCard
            title="재달성률"
            percent={reattainmentRate}
            fractionText={`${reattainedCount} / ${postponedCount || 0}`}
            color={goalColor}
            size={126}
            strokeWidth={9}
            sizeVariant="medium"
            denominator={postponedCount}
          />
        </View>
      </View>
    </View>
  );
}

export default MonthOverviewSection;
