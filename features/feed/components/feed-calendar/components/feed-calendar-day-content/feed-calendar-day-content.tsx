import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { MonthlyWeeklyDDuDuType } from "@/types/response/feed/feed";

import useFeedCalendarDayContent from "../../hooks/use-feed-calendar-day-content/use-feed-calendar-day-content";
import DailyDDuDu from "../daily-ddudu/daily-ddudu";

export interface FeedCalendarDayContentProps {
  today: string;
  date: string;
  day?: number;
  monthlyWeeklyDDuDuType: MonthlyWeeklyDDuDuType[];
  selectedDate?: string; // YYYY-MM-DD
  disabled?: boolean;
  onPress: (date: string) => void;
}

function FeedCalendarDayContent({
  today,
  date,
  day,
  monthlyWeeklyDDuDuType,
  selectedDate,
  disabled = false,
  onPress,
}: FeedCalendarDayContentProps) {
  const { isSelected, handlePressDate } = useFeedCalendarDayContent({
    today,
    date,
    disabled,
    selectedDate,
    onPress,
  });
  const daily = monthlyWeeklyDDuDuType?.find((ddudu) => ddudu.date === date);

  return (
    <Pressable
      onPress={handlePressDate}
      className={`items-center justify-center gap-2 w-[3rem] h-[5rem] ${isSelected ? "bg-sub_2 rounded-radius5" : ""}`}
    >
      {daily && daily.totalCount > 0 ? (
        <DailyDDuDu
          totalCount={daily.totalCount}
          doneCount={daily.totalCount - daily.uncompletedCount}
          restCount={daily.uncompletedCount}
        />
      ) : (
        <View
          className={`rounded-full shrink-0 w-[2rem] h-[2rem] bg-sub_1 border ${isSelected ? "border-sub_3" : ""} ${disabled ? "border-sub_gray_500" : ""}`}
        />
      )}

      <SpoqaText
        weight={`${isSelected ? "bold" : "regular"}`}
        className={`text-size10 ${isSelected ? "text-sub_3" : ""} ${disabled ? "text-sub_gray_500" : ""}`}
      >
        {day}
      </SpoqaText>
    </Pressable>
  );
}

export default FeedCalendarDayContent;
