import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
import { Calendar, CalendarProvider } from "react-native-calendars";
import { DateData, DayState, MarkedDates } from "react-native-calendars/src/types";
import Animated, {
  Easing,
  type SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { WeekCalendar } from "@/components";
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
  externalOpenProgress,
  onCalendarHeightRangeChange,
}: FeedCalendarProps) {
  const { width: screenWidth } = useWindowDimensions();
  const isDesktopWidth = screenWidth >= 1024;
  const calendarContainerClassName = useMemo(
    () => `min-h-px min-w-px ${isDesktopWidth ? "w-1/2 self-start" : "w-full self-stretch"}`,
    [isDesktopWidth],
  );
  const [calendarWidth, setCalendarWidth] = useState(0);
  const [monthHeight, setMonthHeight] = useState(0);
  const [weekHeight, setWeekHeight] = useState(0);
  const lastHandledMonthRef = useRef("");
  const internalOpenProgress = useSharedValue(1);
  const openProgress = externalOpenProgress ?? internalOpenProgress;
  const { handleMonthChange } = useGoalsDDuDuMutation({ type: "MONTH", date, onSelectDate });
  const {
    isOpen,
    visibleDate,
    handleToggleCalendar,
    handleMovePeriod,
    handleDisplayMonth,
    handleSelectCalendarDate,
  } = useFeedCalendarNavigation({
    date,
    onSelectDate,
    onVisibleMonthChange: useCallback(
      (dateString: string) => {
        const monthKey = dateString.slice(0, 7);
        if (lastHandledMonthRef.current === monthKey) {
          return;
        }

        lastHandledMonthRef.current = monthKey;
        handleMonthChange({ dateString } as DateData);
      },
      [handleMonthChange],
    ),
  });

  useEffect(() => {
    if (!onReadyToggleCalendar) {
      return;
    }

    onReadyToggleCalendar(handleToggleCalendar);
  }, [handleToggleCalendar, onReadyToggleCalendar]);

  useEffect(() => {
    onCalendarToggled?.(isOpen);
  }, [isOpen, onCalendarToggled]);

  useEffect(() => {
    if (externalOpenProgress) {
      return;
    }

    internalOpenProgress.value = withTiming(isOpen ? 1 : 0, {
      duration: 220,
      easing: Easing.linear,
    });
  }, [externalOpenProgress, internalOpenProgress, isOpen]);

  useEffect(() => {
    if (!onCalendarHeightRangeChange) {
      return;
    }

    const resolvedMonthHeight = monthHeight || 360;
    const resolvedWeekHeight = weekHeight || 120;
    onCalendarHeightRangeChange(Math.max(1, resolvedMonthHeight - resolvedWeekHeight));
  }, [monthHeight, onCalendarHeightRangeChange, weekHeight]);

  const calendarAnimatedStyle = useAnimatedStyle(() => {
    const resolvedMonthHeight = monthHeight || 360;
    const resolvedWeekHeight = weekHeight || 120;

    return {
      height: interpolate(openProgress.value, [0, 1], [resolvedWeekHeight, resolvedMonthHeight]),
      overflow: "hidden",
    };
  }, [monthHeight, weekHeight]);

  const monthAnimatedStyle = useAnimatedStyle(() => ({
    opacity: openProgress.value,
  }));

  const weekAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - openProgress.value,
  }));

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

  const dayComponent = useCallback(
    ({
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
    },
    [date, handleSelectCalendarDate, isOpen, monthlyStatsByDate, visibleDate],
  );

  return (
    <View className="items-center py-2 w-full">
      <View
        className={calendarContainerClassName}
        onLayout={(event) => {
          setCalendarWidth(event.nativeEvent.layout.width);
        }}
      >
        <View>
          <FeedCalendarHeader
            displayMonth={handleDisplayMonth}
            onPrev={() => handleMovePeriod("prev")}
            onNext={() => handleMovePeriod("next")}
          />

          <Animated.View style={calendarAnimatedStyle}>
            <Animated.View
              style={[{ position: "absolute", top: 0, left: 0, right: 0 }, monthAnimatedStyle]}
              pointerEvents={isOpen ? "auto" : "none"}
              onLayout={(event) => {
                const nextMonthHeight = event.nativeEvent.layout.height;
                if (nextMonthHeight > 0 && Math.abs(nextMonthHeight - monthHeight) > 1) {
                  setMonthHeight(nextMonthHeight);
                }
              }}
            >
              <Calendar
                current={visibleDate}
                firstDay={1}
                hideExtraDays={false}
                hideArrows
                markedDates={markedDates}
                renderHeader={() => <View />}
                onMonthChange={(newDate) => {
                  handleSelectCalendarDate(newDate.dateString);
                }}
                dayComponent={dayComponent}
              />
            </Animated.View>

            <Animated.View
              style={[{ position: "absolute", top: 0, left: 0, right: 0 }, weekAnimatedStyle]}
              pointerEvents={isOpen ? "none" : "auto"}
              onLayout={(event) => {
                const nextWeekHeight = event.nativeEvent.layout.height;
                if (nextWeekHeight > 0 && Math.abs(nextWeekHeight - weekHeight) > 1) {
                  setWeekHeight(nextWeekHeight);
                }
              }}
            >
              <CalendarProvider
                date={visibleDate}
                onDateChanged={(nextDate) => {
                  handleSelectCalendarDate(nextDate);
                }}
              >
                <WeekCalendar
                  firstDay={1}
                  calendarWidth={calendarWidth || undefined}
                  markedDates={markedDates}
                  dayComponent={dayComponent}
                />
              </CalendarProvider>
            </Animated.View>
          </Animated.View>

          <View className="items-center justify-center py-2 bg-white_100 rounded-b-radius10">
            <Pressable
              onPress={handleToggleCalendar}
              hitSlop={8}
            >
              <View className="h-[0.35rem] w-[2.8rem] rounded-full bg-sub_gray_500" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export default FeedCalendar;
