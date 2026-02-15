import { useMemo, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { CalendarProvider } from "react-native-calendars";
import { UpdateSources } from "react-native-calendars/src/expandableCalendar/commons";

import { WeekCalendar } from "@/components";
import { formatDateToYYYYMMDD } from "@/utils";

export interface WeekCalendarViewProps {
  handleDateChange?: (date: string, updateSource: UpdateSources) => void;
}

function WeekCalendarView({ handleDateChange }: WeekCalendarViewProps) {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(formatDateToYYYYMMDD(today));
  const [calendarWidth, setCalendarWidth] = useState<number>();

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event?.nativeEvent?.layout?.width ?? 0;

    if (!nextWidth) {
      return;
    }

    setCalendarWidth(nextWidth);
  };

  return (
    <View className="flex-1 p-4">
      <CalendarProvider
        date={selectedDate}
        onDateChanged={(date, updateSource) => {
          setSelectedDate(date);
          handleDateChange?.(date, updateSource);
        }}
      >
        <View
          className="w-full"
          onLayout={handleLayout}
        >
          {!!calendarWidth && <WeekCalendar calendarWidth={calendarWidth} />}
        </View>
      </CalendarProvider>
    </View>
  );
}

export default WeekCalendarView;
