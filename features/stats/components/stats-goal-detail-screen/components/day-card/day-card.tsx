import { View } from "react-native";

import { SpoqaText } from "@/components";
import { StatsDetailDayOfWeekStatsType } from "@/types/response/stats/stats";

import DayOfWeekBar from "../day-of-week-bar/day-of-week-bar";

interface DayCardProps {
  title: string;
  subtitle: string;
  stats?: StatsDetailDayOfWeekStatsType;
  color: string;
  dayOrder: string[];
  dayLabelMap: Record<string, string>;
}

const getDayCount = (stats: StatsDetailDayOfWeekStatsType | undefined, day: string) => {
  if (!stats?.stats) {
    return 0;
  }

  const value = Number(stats.stats[day] ?? 0);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return value;
};

function DayCard({ title, subtitle, stats, color, dayOrder, dayLabelMap }: DayCardProps) {
  const values = dayOrder.map((day) => getDayCount(stats, day));
  const max = Math.max(...values, 0);

  return (
    <View className="rounded-radius15 bg-sub_1 px-[1.2rem] py-[1.4rem]">
      <View className="items-center">
        <View className="rounded-circle bg-example_gray_100 px-[1.2rem] py-[0.5rem]">
          <SpoqaText
            weight="semiBold"
            className="text-size15 text-black_500"
          >
            {title}
          </SpoqaText>
        </View>
        <SpoqaText className="mt-[0.8rem] text-center text-size13 text-example_gray_800">
          {subtitle}
        </SpoqaText>
      </View>

      <View className="mt-[1rem] border-t border-sub_gray_200 pt-[1rem]">
        <View className="flex-row items-end justify-between px-[0.2rem]">
          {dayOrder.map((day, index) => (
            <DayOfWeekBar
              key={`${title}-${day}`}
              label={dayLabelMap[day]}
              ratio={max > 0 ? (values[index] / max) * 100 : 0}
              color={color}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export default DayCard;
