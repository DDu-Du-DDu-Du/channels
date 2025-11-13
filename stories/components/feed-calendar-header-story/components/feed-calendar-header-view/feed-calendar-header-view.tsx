import { View } from "react-native";

import FeedCalendarHeader from "@/components/calendar/feed-calendar/components/feed-calendar-header/feed-calendar-header";
import { MonthlyGoalMemoType } from "@/types/response/feed/feed";

export interface FeedCalendarHeaderViewProps {
  currentYear?: number;
  currentMonth?: number;
  type?: "week" | "month";
  periodGoalMemo?: MonthlyGoalMemoType;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onSubmitPeriodGoalMemo?: (contents: string) => void;
}

function FeedCalendarHeaderView({
  currentYear = new Date().getFullYear(),
  currentMonth = new Date().getMonth() + 1,
  type = "month",
  periodGoalMemo,
  onPrevMonth,
  onNextMonth,
  onSubmitPeriodGoalMemo,
}: FeedCalendarHeaderViewProps) {
  const yearMonth = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <FeedCalendarHeader
        yearMonth={yearMonth}
        type={type}
        periodGoalMemo={periodGoalMemo}
        handlePrevToMonth={() => onPrevMonth?.()}
        handleNextToMonth={() => onNextMonth?.()}
      />
    </View>
  );
}

export default FeedCalendarHeaderView;
