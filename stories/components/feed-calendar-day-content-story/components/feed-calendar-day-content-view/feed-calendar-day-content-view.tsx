import { useMemo, useState } from "react";
import { View } from "react-native";

import FeedCalendarDayContent from "@/components/calendar/feed-calendar/components/feed-calendar-day-content/feed-calendar-day-content";
import { MonthlyWeeklyDDuDuType } from "@/types/response/feed/feed";

export interface FeedCalendarDayContentViewProps {
  date?: string; // YYYY-MM-DD
  today?: string; // YYYY-MM-DD
  day?: number; // 1-31
  monthlyWeeklyDDuDuType?: MonthlyWeeklyDDuDuType[];
  selectedDate?: string; // YYYY-MM-DD
  onPress?: (formattedDate: string) => void;
}

function FeedCalendarDayContentView({
  date,
  today,
  day,
  monthlyWeeklyDDuDuType,
  selectedDate,
  onPress,
}: FeedCalendarDayContentViewProps) {
  const todayStr = useMemo(() => today ?? new Date().toISOString().slice(0, 10), [today]);
  const dateStr = useMemo(() => {
    const base = date ?? todayStr;
    if (day == null) return base;
    const [y, m] = base.split("-");
    const d = Math.min(31, Math.max(1, day));
    return `${y}-${m}-${String(d).padStart(2, "0")}`;
  }, [date, todayStr, day]);
  const [selected, setSelected] = useState<string | undefined>(selectedDate);
  const monthly = monthlyWeeklyDDuDuType ?? [
    { date: todayStr, totalCount: 8, uncompletedCount: 3 },
  ];

  return (
    <View className="flex-1 items-center justify-center">
      <FeedCalendarDayContent
        today={todayStr}
        date={dateStr}
        day={day ?? Number(dateStr.split("-")[2])}
        monthlyWeeklyDDuDuType={monthly}
        selectedDate={selected}
        onPress={(d) => {
          setSelected(d);
          onPress?.(d);
        }}
      />
    </View>
  );
}

export default FeedCalendarDayContentView;
