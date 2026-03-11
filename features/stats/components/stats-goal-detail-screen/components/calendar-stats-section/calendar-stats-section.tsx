import { useMemo } from "react";
import { Pressable, View } from "react-native";

import { BottomMultipleCalendar, SpoqaText } from "@/components";
import { StatsDetailCalendarStatsType } from "@/types/response/stats/stats";

import { useRouter } from "expo-router";

interface CalendarStatsSectionProps {
  fromMonth: string;
  achievedCalendarStats?: StatsDetailCalendarStatsType;
  postponedCalendarStats?: StatsDetailCalendarStatsType;
}

function CalendarStatsSection({
  fromMonth,
  achievedCalendarStats,
  postponedCalendarStats,
}: CalendarStatsSectionProps) {
  const router = useRouter();
  const isCalendarUnavailable =
    achievedCalendarStats?.isAvailable === false && postponedCalendarStats?.isAvailable === false;

  const markedDates = useMemo(() => {
    const map: Record<string, any> = {};

    achievedCalendarStats?.stats?.forEach((item) => {
      const dots = map[item.date]?.dots ?? [];
      map[item.date] = {
        ...(map[item.date] ?? {}),
        marked: true,
        dots: [...dots, { key: "achieved", color: "#00C73C" }],
      };
    });

    postponedCalendarStats?.stats?.forEach((item) => {
      const dots = map[item.date]?.dots ?? [];
      const hasPostponed = dots.some((dot: { key: string }) => dot.key === "postponed");

      map[item.date] = {
        ...(map[item.date] ?? {}),
        marked: true,
        dots: hasPostponed ? dots : [...dots, { key: "postponed", color: "#ED4044" }],
      };
    });

    return map;
  }, [achievedCalendarStats?.stats, postponedCalendarStats?.stats]);

  if (isCalendarUnavailable) {
    return null;
  }

  const monthLabel = `${fromMonth.substring(0, 4)}년 ${Number(fromMonth.substring(5, 7))}월 투두`;

  return (
    <View className="mt-[1.2rem] rounded-radius15 bg-role-surface-panel dark:bg-role-dark-surface-panel px-[1.4rem] py-[1.4rem]">
      <BottomMultipleCalendar
        markedDates={markedDates}
        disableDayPress
        markingType="multi-dot"
        monthLabel={monthLabel}
        hideArrow
      />

      <View className="mt-[0.8rem] flex-row items-center justify-between">
        <View className="w-[7.2rem]" />

        <View className="flex-1 flex-row items-center justify-center gap-[1.2rem]">
          <View className="flex-row items-center gap-[0.4rem]">
            <View className="size-[0.8rem] rounded-circle bg-role-status-success dark:bg-role-dark-status-success" />
            <SpoqaText className="text-size12 text-role-text-tertiary dark:text-role-dark-text-tertiary">
              달성
            </SpoqaText>
          </View>
          <View className="flex-row items-center gap-[0.4rem]">
            <View className="size-[0.8rem] rounded-circle bg-role-status-error dark:bg-role-dark-status-error" />
            <SpoqaText className="text-size12 text-role-text-tertiary dark:text-role-dark-text-tertiary">
              미룸
            </SpoqaText>
          </View>
        </View>

        <View className="w-[7.2rem] items-end">
          <Pressable onPress={() => router.push("/feed")}>
            <SpoqaText className="text-size11 text-role-text-secondary dark:text-role-dark-text-secondary">
              피드로 이동
            </SpoqaText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default CalendarStatsSection;
