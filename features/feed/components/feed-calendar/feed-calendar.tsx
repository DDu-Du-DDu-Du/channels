import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, View, useWindowDimensions } from "react-native";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import { DateData, DayState, MarkedDates } from "react-native-calendars/src/types";
import type { SharedValue } from "react-native-reanimated";

import { YearMonthPickerSheet } from "@/components";
import type { YearMonthValue } from "@/components/year-month-picker/year-month-picker";
import { useCalendarFirstDay } from "@/hooks";
import { useSettingsStore } from "@/stores";
import type { MonthlyWeeklyTodoType } from "@/types/response/feed/feed";
import { getCalendarTheme } from "@/utils";

import { FeedCalendarDayContent, FeedCalendarHeader } from "./components";
import { useFeedCalendarNavigation, useGoalsTodoMutation } from "./hooks";

export interface FeedCalendarProps {
  date: string;
  monthlyTodos: MonthlyWeeklyTodoType[];
  onSelectDate: (date: string) => void;
  onCalendarToggled?: (isOpen: boolean) => void;
  onReadyToggleCalendar?: (handleToggleCalendar: () => void) => void;
  externalOpenProgress?: SharedValue<number>;
  onCalendarHeightRangeChange?: (heightRange: number) => void;
}

function FeedCalendar({
  date,
  monthlyTodos,
  onSelectDate,
  onCalendarToggled,
  onReadyToggleCalendar,
  externalOpenProgress: _externalOpenProgress,
  onCalendarHeightRangeChange: _onCalendarHeightRangeChange,
}: FeedCalendarProps) {
  const firstDay = useCalendarFirstDay();
  const isDarkMode = useSettingsStore((state) => state.display.isDarkMode);
  const { width: screenWidth } = useWindowDimensions();
  const isWebDesktop = Platform.OS === "web" && screenWidth >= 1024;
  const calendarWidth = useMemo(() => (isWebDesktop ? "50%" : "100%"), [isWebDesktop]);
  const { handleMonthChange } = useGoalsTodoMutation();
  const expandableCalendarRef = useRef<{ toggleCalendarPosition: () => boolean } | null>(null);
  const lastHandledMonthRef = useRef<string>("");
  const [isYearMonthSheetOpen, setIsYearMonthSheetOpen] = useState(false);

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

  const handleOpenYearMonthSheet = () => {
    setYearMonthDraft(yearMonthValue);
    setIsYearMonthSheetOpen(true);
  };

  const handleCloseYearMonthSheet = () => {
    setIsYearMonthSheetOpen(false);
  };

  const handleConfirmYearMonthSheet = () => {
    const { year, month } = yearMonthDraft;
    const nextDate = `${year}-${String(month).padStart(2, "0")}-01`;
    handleSelectCalendarDate(nextDate);
    setIsYearMonthSheetOpen(false);
  };

  const yearMonthValue = useMemo(() => {
    const [yearStr, monthStr] = visibleDate.split("-");
    return {
      year: Number(yearStr) || new Date().getFullYear(),
      month: Number(monthStr) || new Date().getMonth() + 1,
    };
  }, [visibleDate]);
  const [yearMonthDraft, setYearMonthDraft] = useState<YearMonthValue>(yearMonthValue);
  const visibleMonthKey = useMemo(() => visibleDate.slice(0, 7), [visibleDate]);

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
    return monthlyTodos.reduce<Record<string, MonthlyWeeklyTodoType>>((acc, item) => {
      const normalizedDate = item.date.slice(0, 10);
      acc[normalizedDate] = item;
      return acc;
    }, {});
  }, [monthlyTodos]);

  const markedDates = useMemo(() => {
    return monthlyTodos.reduce<MarkedDates>((acc, item) => {
      const normalizedDate = item.date.slice(0, 10);
      acc[normalizedDate] = { marked: item.totalCount > 0 };
      return acc;
    }, {});
  }, [monthlyTodos]);
  const calendarTheme = useMemo(
    () =>
      getCalendarTheme({
        themeName: "wireframe",
        mode: isDarkMode ? "dark" : "light",
        firstDay,
      }),
    [firstDay, isDarkMode],
  );
  const expandableCalendarKey = useMemo(
    () => `expandable-${visibleMonthKey}-${firstDay}-${isDarkMode ? "dark" : "light"}`,
    [firstDay, isDarkMode, visibleMonthKey],
  );

  return (
    <View className="items-center w-full">
      <View
        className="relative min-h-px min-w-px"
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
            key={expandableCalendarKey}
            ref={expandableCalendarRef}
            current={visibleDate}
            firstDay={firstDay}
            hideArrows
            renderHeader={() => (
              <FeedCalendarHeader
                displayMonth={handleDisplayMonth}
                onPressMonthPicker={handleOpenYearMonthSheet}
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
            theme={calendarTheme}
          />
        </CalendarProvider>
      </View>

      <YearMonthPickerSheet
        open={isYearMonthSheetOpen}
        isRangeEnabled={false}
        singleValue={yearMonthDraft}
        fromValue={yearMonthDraft}
        toValue={yearMonthDraft}
        onChangeSingle={setYearMonthDraft}
        onChangeFrom={setYearMonthDraft}
        onChangeTo={setYearMonthDraft}
        onConfirm={handleConfirmYearMonthSheet}
        onClose={handleCloseYearMonthSheet}
      />
    </View>
  );
}

export default FeedCalendar;
