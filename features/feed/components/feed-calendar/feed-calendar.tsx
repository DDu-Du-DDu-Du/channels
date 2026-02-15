import { useCallback, useEffect, useMemo, useRef } from "react";
import { Platform, View, useWindowDimensions } from "react-native";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import { DateData, DayState, MarkedDates } from "react-native-calendars/src/types";
import type { SharedValue } from "react-native-reanimated";

import type { MonthlyWeeklyDDuDuType } from "@/types/response/feed/feed";

import { FeedCalendarDayContent, FeedCalendarHeader } from "./components";
import { useFeedCalendarNavigation, useGoalsDDuDuMutation } from "./hooks";

export interface FeedCalendarProps {
  date: string;
  monthlyDDuDus: MonthlyWeeklyDDuDuType[];
  onSelectDate: (date: string) => void;
  onCalendarToggled?: (isOpen: boolean) => void;
  onReadyToggleCalendar?: (handleToggleCalendar: () => void) => void;
  externalOpenProgress?: SharedValue<number>;
  onCalendarHeightRangeChange?: (heightRange: number) => void;
}

function FeedCalendar({
  date,
  monthlyDDuDus,
  onSelectDate,
  onCalendarToggled,
  onReadyToggleCalendar,
  externalOpenProgress: _externalOpenProgress,
  onCalendarHeightRangeChange: _onCalendarHeightRangeChange,
}: FeedCalendarProps) {
  const { width: screenWidth } = useWindowDimensions();
  const isWebDesktop = Platform.OS === "web" && screenWidth >= 1024;
  const calendarWidth = useMemo(() => (isWebDesktop ? "50%" : "100%"), [isWebDesktop]);
  const { handleMonthChange } = useGoalsDDuDuMutation({ type: "MONTH", date, onSelectDate });
  const expandableCalendarRef = useRef<{ toggleCalendarPosition: () => boolean } | null>(null);
  const lastHandledMonthRef = useRef<string>("");

  const handleVisibleMonthChange = useCallback(
    (dateString: string) => {
      const monthKey = dateString.slice(0, 7);
      if (lastHandledMonthRef.current === monthKey) {
        return;
      }

      lastHandledMonthRef.current = monthKey;
      handleMonthChange({ dateString } as DateData);
    },
    [handleMonthChange],
  );

  const {
    isOpen,
    visibleDate,
    handleCalendarToggled,
    handleMovePeriod,
    handleDisplayMonth,
    handleSelectCalendarDate,
  } = useFeedCalendarNavigation({
    date,
    onSelectDate,
    onVisibleMonthChange: handleVisibleMonthChange,
  });

  const handleToggleCalendar = useCallback(() => {
    expandableCalendarRef.current?.toggleCalendarPosition();
  }, []);

  useEffect(() => {
    if (!onReadyToggleCalendar) {
      return;
    }

    onReadyToggleCalendar(handleToggleCalendar);
  }, [handleToggleCalendar, onReadyToggleCalendar]);

  const dayComponent = ({
    date: calendarDate,
    onPress,
  }: {
    date?: DateData;
    state?: DayState;
    onPress?: (date?: DateData) => void;
  }) => {
    const visibleMonth = new Date(`${visibleDate}T00:00:00.000Z`).getUTCMonth();
    const currentDateString = calendarDate?.dateString ?? "";
    const isOtherMonth = calendarDate?.month !== visibleMonth + 1;
    const disabled = isOpen ? isOtherMonth : false;
    const dailyStats = monthlyStatsByDate[currentDateString];

    const handlePressCalendarDate = () => {
      if (!currentDateString || disabled) {
        return;
      }

      onPress?.(calendarDate);
      handleSelectCalendarDate(currentDateString);
    };

    return (
      <FeedCalendarDayContent
        date={calendarDate?.dateString ?? ""}
        day={calendarDate?.day}
        dailyStats={dailyStats}
        onPress={handlePressCalendarDate}
        selectedDate={date}
        disabled={disabled}
      />
    );
  };

  const monthlyStatsByDate = useMemo(() => {
    return monthlyDDuDus.reduce<Record<string, MonthlyWeeklyDDuDuType>>((acc, item) => {
      const normalizedDate = item.date.slice(0, 10);
      acc[normalizedDate] = item;
      return acc;
    }, {});
  }, [monthlyDDuDus]);

  const markedDates = useMemo(() => {
    return monthlyDDuDus.reduce<MarkedDates>((acc, item) => {
      const normalizedDate = item.date.slice(0, 10);
      acc[normalizedDate] = { marked: item.totalCount > 0 };
      return acc;
    }, {});
  }, [monthlyDDuDus]);

  return (
    <View className="items-center py-2 w-full">
      <View
        className="min-h-px min-w-px"
        style={{
          width: calendarWidth,
          alignSelf: isWebDesktop ? "flex-start" : "stretch",
        }}
      >
        <CalendarProvider
          date={visibleDate}
          onDateChanged={(nextDate) => {
            handleSelectCalendarDate(nextDate);
          }}
        >
          <ExpandableCalendar
            ref={expandableCalendarRef}
            current={visibleDate}
            firstDay={1}
            hideArrows
            renderHeader={() => (
              <FeedCalendarHeader
                displayMonth={handleDisplayMonth}
                onPrev={() => handleMovePeriod("prev")}
                onNext={() => handleMovePeriod("next")}
              />
            )}
            onCalendarToggled={(nextIsOpen) => {
              handleCalendarToggled(nextIsOpen);
              onCalendarToggled?.(nextIsOpen);
            }}
            onVisibleMonthsChange={(months) => {
              const currentVisibleMonth = months[0]?.dateString;
              if (!currentVisibleMonth) {
                return;
              }

              handleSelectCalendarDate(currentVisibleMonth);
            }}
            markedDates={markedDates}
            dayComponent={dayComponent}
          />
        </CalendarProvider>
      </View>
    </View>
  );
}

export default FeedCalendar;
