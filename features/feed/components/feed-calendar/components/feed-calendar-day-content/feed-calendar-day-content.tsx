import { memo } from "react";
import { Pressable, View } from "react-native";

import { ProgressRing, SpoqaText } from "@/components";
import { MonthlyWeeklyDDuDuType } from "@/types/response/feed/feed";

import useFeedCalendarDayContent from "../../hooks/use-feed-calendar-day-content/use-feed-calendar-day-content";

export interface FeedCalendarDayContentProps {
  date: string;
  day?: number;
  dailyStats?: MonthlyWeeklyDDuDuType;
  selectedDate?: string; // YYYY-MM-DD
  disabled?: boolean;
  onPress?: (date: string) => void;
}

function FeedCalendarDayContent({
  date,
  day,
  dailyStats,
  selectedDate,
  disabled = false,
  onPress,
}: FeedCalendarDayContentProps) {
  const { isSelected, handlePressDate } = useFeedCalendarDayContent({
    date,
    disabled,
    selectedDate,
    onPress,
  });

  const totalCount = dailyStats?.totalCount ?? 0;
  const uncompletedCount = dailyStats?.uncompletedCount ?? 0;
  // TODO(server): completedCount API field is expected to replace this derived value.
  const completedCount = Math.max(0, totalCount - uncompletedCount);
  const hasTodo = totalCount > 0;
  const progressPercent = hasTodo ? (completedCount / totalCount) * 100 : 0;

  return (
    <Pressable
      onPress={handlePressDate}
      className="h-[5rem] w-[3rem] items-center justify-center"
    >
      <View className="relative h-[2.8rem] w-[2.8rem] items-center justify-center">
        {isSelected && (
          <View
            className={`absolute h-[2.6rem] w-[2.6rem] rounded-full ${
              disabled
                ? "bg-role-surface-subtle dark:bg-role-dark-surface-subtle"
                : "bg-role-surface-card dark:bg-role-dark-surface-card"
            }`}
          />
        )}

        {hasTodo && (
          <ProgressRing
            percent={progressPercent}
            color="#1363DE"
            size={24}
            strokeWidth={2}
            trackColor="#D0D0D0"
            animate={isSelected}
            className="absolute"
          />
        )}

        <SpoqaText
          weight={`${isSelected ? "bold" : "regular"}`}
          className={`text-size10 ${
            disabled
              ? "text-role-text-tertiary dark:text-role-dark-text-tertiary"
              : isSelected
                ? "text-role-text-secondary dark:text-role-dark-text-secondary"
                : "text-role-text-primary dark:text-role-dark-text-primary"
          }`}
        >
          {day}
        </SpoqaText>
      </View>
    </Pressable>
  );
}

const areFeedCalendarDayContentPropsEqual = (
  prev: FeedCalendarDayContentProps,
  next: FeedCalendarDayContentProps,
) => {
  const prevIsSelected = prev.selectedDate === prev.date;
  const nextIsSelected = next.selectedDate === next.date;
  const prevTotalCount = prev.dailyStats?.totalCount ?? 0;
  const nextTotalCount = next.dailyStats?.totalCount ?? 0;
  const prevUncompletedCount = prev.dailyStats?.uncompletedCount ?? 0;
  const nextUncompletedCount = next.dailyStats?.uncompletedCount ?? 0;

  return (
    prev.date === next.date &&
    prev.day === next.day &&
    prev.disabled === next.disabled &&
    prevIsSelected === nextIsSelected &&
    prevTotalCount === nextTotalCount &&
    prevUncompletedCount === nextUncompletedCount
  );
};

export default memo(FeedCalendarDayContent, areFeedCalendarDayContentPropsEqual);
