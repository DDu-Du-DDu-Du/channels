import { View } from "react-native";

import { StatsDayOfWeekType, StatsDetailDayOfWeekStatsType } from "@/types/response/stats/stats";

import DayCard from "../day-card/day-card";

interface DayOfWeekStatsSectionProps {
  achievedDayOfWeekStats?: StatsDetailDayOfWeekStatsType;
  postponedDayOfWeekStats?: StatsDetailDayOfWeekStatsType;
  goalColor: string;
}

const DAY_ORDER: StatsDayOfWeekType[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const DAY_LABEL: Record<StatsDayOfWeekType, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

const getTotalCount = (stats?: StatsDetailDayOfWeekStatsType) => {
  if (!stats?.stats) {
    return 0;
  }

  return Object.values(stats.stats).reduce((acc, value) => {
    const next = Number(value ?? 0);
    return Number.isFinite(next) ? acc + next : acc;
  }, 0);
};

const formatMostActiveDays = (days?: StatsDayOfWeekType[]) => {
  if (!days?.length) {
    return "";
  }

  const unique = Array.from(new Set(days));
  const sorted = [...unique].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
  return sorted.map((day) => DAY_LABEL[day]).join(", ");
};

function DayOfWeekStatsSection({
  achievedDayOfWeekStats,
  postponedDayOfWeekStats,
  goalColor,
}: DayOfWeekStatsSectionProps) {
  const achievedTotal = getTotalCount(achievedDayOfWeekStats);
  const postponedTotal = getTotalCount(postponedDayOfWeekStats);

  const achievedMostDays = formatMostActiveDays(achievedDayOfWeekStats?.mostActiveDays);
  const postponedMostDays = formatMostActiveDays(postponedDayOfWeekStats?.mostActiveDays);

  return (
    <View className="mt-[1.2rem] gap-[1rem]">
      <DayCard
        title="투두요일"
        subtitle={
          achievedTotal > 0 && achievedMostDays
            ? `${achievedMostDays}요일에 가장 많은 투두를 해요`
            : "아직 달성한 투두가 없어요. 투두를 먼저 달성해볼까요?"
        }
        stats={achievedDayOfWeekStats}
        color={goalColor}
        dayOrder={DAY_ORDER}
        dayLabelMap={DAY_LABEL}
      />

      <DayCard
        title="자주 미룬 요일"
        subtitle={
          postponedTotal > 0 && postponedMostDays
            ? `${postponedMostDays}요일에 가장 많이 미뤘어요`
            : "미룬 투두가 없어요 🎉"
        }
        stats={postponedDayOfWeekStats}
        color={goalColor}
        dayOrder={DAY_ORDER}
        dayLabelMap={DAY_LABEL}
      />
    </View>
  );
}

export default DayOfWeekStatsSection;
