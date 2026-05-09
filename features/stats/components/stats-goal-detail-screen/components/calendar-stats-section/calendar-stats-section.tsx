import { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { DateData } from "react-native-calendars";

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

  const availableYearMonths = useMemo(() => {
    return Array.from(
      new Set([
        ...(achievedCalendarStats ?? []).map((item) => item.yearMonth),
        ...(postponedCalendarStats ?? []).map((item) => item.yearMonth),
      ]),
    ).sort();
  }, [achievedCalendarStats, postponedCalendarStats]);

  const [currentYearMonth, setCurrentYearMonth] = useState(() =>
    availableYearMonths.includes(fromMonth) ? fromMonth : (availableYearMonths[0] ?? fromMonth),
  );

  useEffect(() => {
    if (!availableYearMonths.length) {
      return;
    }

    setCurrentYearMonth(
      availableYearMonths.includes(fromMonth) ? fromMonth : availableYearMonths[0],
    );
  }, [availableYearMonths, fromMonth]);

  const achievedMonthStats = useMemo(
    () => achievedCalendarStats?.find((item) => item.yearMonth === currentYearMonth)?.stats ?? [],
    [achievedCalendarStats, currentYearMonth],
  );
  const postponedMonthStats = useMemo(
    () => postponedCalendarStats?.find((item) => item.yearMonth === currentYearMonth)?.stats ?? [],
    [currentYearMonth, postponedCalendarStats],
  );

  const markedDates = useMemo(() => {
    const map: Record<string, any> = {};

    achievedMonthStats.forEach((item) => {
      const dots = map[item.date]?.dots ?? [];
      const hasAchieved = dots.some((dot: { key: string }) => dot.key === "achieved");

      map[item.date] = {
        ...(map[item.date] ?? {}),
        marked: true,
        dots: hasAchieved ? dots : [...dots, { key: "achieved", color: "#00C73C" }],
      };
    });

    postponedMonthStats.forEach((item) => {
      const dots = map[item.date]?.dots ?? [];
      const hasPostponed = dots.some((dot: { key: string }) => dot.key === "postponed");

      map[item.date] = {
        ...(map[item.date] ?? {}),
        marked: true,
        dots: hasPostponed ? dots : [...dots, { key: "postponed", color: "#ED4044" }],
      };
    });

    return map;
  }, [achievedMonthStats, postponedMonthStats]);

  if (!availableYearMonths.length) {
    return null;
  }

  const monthLabel = `${currentYearMonth.substring(0, 4)}년 ${Number(currentYearMonth.substring(5, 7))}월 투두`;

  const handleMonthChange = (date: DateData) => {
    const nextYearMonth = date.dateString.slice(0, 7);

    if (availableYearMonths.includes(nextYearMonth)) {
      setCurrentYearMonth(nextYearMonth);
    }
  };

  return (
    <View className="mt-[1.2rem] rounded-radius15 bg-role-surface-panel dark:bg-role-dark-surface-panel px-[1.4rem] py-[1.4rem]">
      <BottomMultipleCalendar
        current={`${currentYearMonth}-01`}
        markedDates={markedDates}
        disableDayPress
        markingType="multi-dot"
        monthLabel={monthLabel}
        availableYearMonths={availableYearMonths}
        onMonthChange={handleMonthChange}
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
