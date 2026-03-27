import { useState } from "react";
import { View } from "react-native";

import FeedCalendar from "@/features/feed/components/feed-calendar/feed-calendar";
import type { MonthlyWeeklyTodoType } from "@/types/response/feed/feed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface FeedCalendarViewProps {
  monthlyTodos?: MonthlyWeeklyTodoType[];
  onSelectDate?: (date: string) => void;
}

function FeedCalendarView({ monthlyTodos, onSelectDate }: FeedCalendarViewProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);
  const sampleMonthly: MonthlyWeeklyTodoType[] = [
    { date: today, totalCount: 5, uncompletedCount: 2 },
  ];

  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <QueryClientProvider client={new QueryClient()}>
        <FeedCalendar
          date={selectedDate}
          monthlyTodos={monthlyTodos ?? sampleMonthly}
          onSelectDate={(d) => {
            setSelectedDate(d);
            onSelectDate?.(d);
          }}
        />
      </QueryClientProvider>
    </View>
  );
}

export default FeedCalendarView;
