import { useState } from "react";
import { LayoutChangeEvent } from "react-native";
import { UpdateSources } from "react-native-calendars/src/expandableCalendar/commons";

interface UseFeedCalendarProps {
  onSelectDate: (date: string) => void;
  handleWeekChange?: (date: string) => Promise<void> | void;
}

function useFeedCalendar({ onSelectDate, handleWeekChange }: UseFeedCalendarProps) {
  const [width, setWidth] = useState<number>();

  const handleWeekCalendarWidth = (event: LayoutChangeEvent) => {
    const newWidth = event?.nativeEvent?.layout?.width ?? 0;

    if (!newWidth) {
      return;
    }

    setWidth(newWidth);
  };

  const handleSwipeWeekCalendar = (date: string, updateSources: UpdateSources) => {
    onSelectDate(date);

    if (updateSources === UpdateSources.WEEK_SCROLL) {
      handleWeekChange?.(date);
    }
  };

  return {
    width,
    handleWeekCalendarWidth,
    handleSwipeWeekCalendar,
  };
}

export default useFeedCalendar;
