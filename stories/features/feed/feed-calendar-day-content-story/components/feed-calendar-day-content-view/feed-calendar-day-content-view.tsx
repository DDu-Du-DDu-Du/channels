import { useMemo, useState } from "react";
import { View } from "react-native";

import FeedCalendarDayContent from "@/features/feed/components/feed-calendar/components/feed-calendar-day-content/feed-calendar-day-content";
import { MonthlyWeeklyDDuDuType } from "@/types/response/feed/feed";

export interface FeedCalendarDayContentViewProps {
  date?: string; // YYYY-MM-DD
  day?: number; // 1-31
  dailyStats?: MonthlyWeeklyDDuDuType;
  selectedDate?: string; // YYYY-MM-DD
  disabled?: boolean;
  onPress?: (date: string) => void;
}

function FeedCalendarDayContentView({
  date,
  day,
  dailyStats,
  selectedDate,
  disabled = false,
  onPress,
}: FeedCalendarDayContentViewProps) {
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const dateStr = useMemo(() => {
    const base = date ?? todayStr;
    if (day == null) return base;
    const [y, m] = base.split("-");
    const d = Math.min(31, Math.max(1, day));
    return `${y}-${m}-${String(d).padStart(2, "0")}`;
  }, [date, todayStr, day]);
  const [selected, setSelected] = useState<string | undefined>(selectedDate);
  const defaultDailyStats = { date: dateStr, totalCount: 8, uncompletedCount: 3 };

  return (
    <View className="flex-1 items-center justify-center">
      <FeedCalendarDayContent
        date={dateStr}
        day={day ?? Number(dateStr.split("-")[2])}
        dailyStats={dailyStats ?? defaultDailyStats}
        selectedDate={selected}
        disabled={disabled}
        onPress={(d) => {
          setSelected(d);
          onPress?.(d);
        }}
      />
    </View>
  );
}

export default FeedCalendarDayContentView;
