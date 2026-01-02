import { View } from "react-native";

import { PeriodType } from "@/components/period-goal-memo/period-goal-memo";
import FeedCalendar from "@/features/feed/components/feed-calendar/feed-calendar";
import type { MonthlyGoalMemoType, MonthlyWeeklyDDuDuType } from "@/types/response/feed/feed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface FeedCalendarViewProps {
  type?: PeriodType;
  monthlyDDuDus?: MonthlyWeeklyDDuDuType[];
  periodGoalMemo?: MonthlyGoalMemoType;
  onSelectDate?: (date: string) => void;
}

function FeedCalendarView({
  type = "MONTH",
  monthlyDDuDus,
  periodGoalMemo,
  onSelectDate,
}: FeedCalendarViewProps) {
  const today = new Date().toISOString().slice(0, 10);
  const sampleMonthly: MonthlyWeeklyDDuDuType[] = [
    { date: today, totalCount: 5, uncompletedCount: 2 },
  ];

  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <QueryClientProvider client={new QueryClient()}>
        <FeedCalendar
          type={type}
          monthlyDDuDus={monthlyDDuDus ?? sampleMonthly}
          periodGoalMemo={periodGoalMemo}
          onSelectDate={(d) => onSelectDate?.(d)}
        />
      </QueryClientProvider>
    </View>
  );
}

export default FeedCalendarView;
