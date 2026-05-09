import { ComponentProps, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { MarkedDates, MarkingTypes } from "react-native-calendars/src/types";

import OutsidePressBackdrop from "@/components/outside-press-backdrop/outside-press-backdrop";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import YearMonthPopover from "@/components/year-month-popover/year-month-popover";
import { useCalendarFirstDay } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";
import { useSettingsStore } from "@/stores";
import { formatDateToYYYYMMDD, getCalendarTheme } from "@/utils";

type CalendarDayComponent = ComponentProps<typeof Calendar>["dayComponent"];

export interface CustomCalendarProps {
  current?: string;
  initialDate?: string;
  minDate?: string;
  maxDate?: string;
  markedDates?: MarkedDates;
  markingType?: MarkingTypes;
  onDayPress?: (day: DateData) => void;
  onMonthChange?: (date: DateData) => void;
  hideArrows?: boolean;
  hideExtraDays?: boolean;
  showSixWeeks?: boolean;
  dayComponent?: CalendarDayComponent;
  minYear?: number;
  maxYear?: number;
  availableYearMonths?: string[];
  monthLabel?: string;
}

const DEFAULT_MIN_YEAR = 1980;
const DEFAULT_MAX_YEAR = 2099;

const parseYYYYMMDD = (dateString: string) => {
  const [yearStr, monthStr, dayStr] = dateString.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (!year || !month || !day) {
    return null;
  }

  return { year, month, day };
};

const toFirstOfMonth = (year: number, month: number) => {
  const monthString = String(month).padStart(2, "0");
  return `${year}-${monthString}-01`;
};

const buildDateData = (dateString: string): DateData | null => {
  const parsed = parseYYYYMMDD(dateString);

  if (!parsed) {
    return null;
  }

  return {
    dateString,
    year: parsed.year,
    month: parsed.month,
    day: parsed.day,
    timestamp: Date.UTC(parsed.year, parsed.month - 1, parsed.day),
  };
};

const addMonths = (dateString: string, delta: number) => {
  const parsed = parseYYYYMMDD(dateString);

  if (!parsed) {
    return dateString;
  }

  const base = new Date(Date.UTC(parsed.year, parsed.month - 1 + delta, 1));

  return toFirstOfMonth(base.getUTCFullYear(), base.getUTCMonth() + 1);
};

const toYearMonth = (dateString: string) => dateString.slice(0, 7);

const toDateString = (yearMonth: string) => `${yearMonth}-01`;

function CustomCalendar({
  current,
  initialDate,
  minDate,
  maxDate,
  markedDates,
  markingType,
  onDayPress,
  onMonthChange,
  hideArrows = false,
  hideExtraDays,
  showSixWeeks,
  dayComponent,
  minYear,
  maxYear,
  availableYearMonths,
  monthLabel,
}: CustomCalendarProps) {
  const { t, i18n } = useTranslation();
  const firstDay = useCalendarFirstDay();
  const isDarkMode = useSettingsStore((state) => state.display.isDarkMode);
  const arrowBg = useThemeColorToken("ui.arrow.bg");
  const arrowIconFill = useThemeColorToken("ui.arrow.icon");

  const initial = current ?? initialDate ?? formatDateToYYYYMMDD(new Date());
  const [visibleDate, setVisibleDate] = useState(initial);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    if (current && current !== visibleDate) {
      setVisibleDate(current);
    }
    // visibleDate is intentionally omitted — we only want to sync when the external prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const parsedVisible = parseYYYYMMDD(visibleDate) ?? { year: 1970, month: 1, day: 1 };
  const availableYearMonthSet = useMemo(
    () => new Set(availableYearMonths ?? []),
    [availableYearMonths],
  );
  const hasAvailableYearMonths = availableYearMonthSet.size > 0;
  const sortedAvailableYearMonths = useMemo(
    () => [...availableYearMonthSet].sort(),
    [availableYearMonthSet],
  );

  const effectiveMinYear = useMemo(() => {
    const base = minYear ?? DEFAULT_MIN_YEAR;
    const parsed = minDate ? parseYYYYMMDD(minDate) : null;
    return parsed ? Math.max(base, parsed.year) : base;
  }, [minDate, minYear]);

  const effectiveMaxYear = useMemo(() => {
    const base = maxYear ?? DEFAULT_MAX_YEAR;
    const parsed = maxDate ? parseYYYYMMDD(maxDate) : null;
    return parsed ? Math.min(base, parsed.year) : base;
  }, [maxDate, maxYear]);

  const headerLabel =
    monthLabel ??
    t("calendar.yearMonth", {
      year: parsedVisible.year,
      month:
        i18n.language === "en"
          ? t(`calendar.months.long.${parsedVisible.month - 1}`)
          : String(parsedVisible.month).padStart(2, "0"),
    });

  const calendarTheme = useMemo(
    () =>
      getCalendarTheme({
        themeName: "wireframe",
        mode: isDarkMode ? "dark" : "light",
        firstDay,
      }),
    [firstDay, isDarkMode],
  );

  const calendarKey = useMemo(
    () => `custom-${visibleDate.slice(0, 7)}-${firstDay}-${isDarkMode ? "dark" : "light"}`,
    [firstDay, isDarkMode, visibleDate],
  );

  const notifyMonthChange = (nextDate: string) => {
    const data = buildDateData(nextDate);

    if (data) {
      onMonthChange?.(data);
    }
  };
  const handleChangeVisibleDate = (nextDate: string) => {
    if (hasAvailableYearMonths && !availableYearMonthSet.has(toYearMonth(nextDate))) {
      return;
    }

    if (nextDate !== visibleDate) {
      setVisibleDate(nextDate);
    }
    notifyMonthChange(nextDate);
  };

  const handleTogglePicker = () => {
    setIsPickerOpen((prev) => !prev);
  };

  const handleClosePicker = () => {
    setIsPickerOpen(false);
  };

  const handlePrevMonth = () => {
    setIsPickerOpen(false);
    const next = addMonths(visibleDate, -1);
    handleChangeVisibleDate(next);
  };

  const handleNextMonth = () => {
    setIsPickerOpen(false);
    const next = addMonths(visibleDate, 1);
    handleChangeVisibleDate(next);
  };

  const handleConfirmYearMonth = ({ year, month }: { year: number; month: number }) => {
    const next = toFirstOfMonth(year, month);
    setIsPickerOpen(false);
    handleChangeVisibleDate(next);
  };

  const handleCalendarMonthChange = (date: DateData) => {
    handleChangeVisibleDate(date.dateString);
  };

  const currentYearMonth = toYearMonth(visibleDate);
  const currentAvailableIndex = sortedAvailableYearMonths.indexOf(currentYearMonth);
  const isPrevDisabled = hasAvailableYearMonths && currentAvailableIndex <= 0;
  const isNextDisabled =
    hasAvailableYearMonths && currentAvailableIndex >= sortedAvailableYearMonths.length - 1;
  const minAvailableDate = sortedAvailableYearMonths[0]
    ? toDateString(sortedAvailableYearMonths[0])
    : minDate;
  const maxAvailableDate = sortedAvailableYearMonths[sortedAvailableYearMonths.length - 1]
    ? toDateString(sortedAvailableYearMonths[sortedAvailableYearMonths.length - 1])
    : maxDate;

  return (
    <View className="w-full">
      <View className="flex-row items-center justify-between px-[1rem] py-[0.8rem]">
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={handleTogglePicker}
        >
          <SpoqaText className="text-size15 text-role-text-primary dark:text-role-dark-text-primary">
            {headerLabel}
          </SpoqaText>
        </Pressable>
        {hideArrows ? null : (
          <View className="flex-row gap-[0.6rem]">
            <Pressable
              accessibilityRole="button"
              onPress={handlePrevMonth}
              disabled={isPrevDisabled}
              className="h-[2.8rem] w-[2.8rem] items-center justify-center rounded-full"
              style={{ backgroundColor: arrowBg, opacity: isPrevDisabled ? 0.35 : 1 }}
            >
              <ChevronLeftIcon
                size={14}
                fill={arrowIconFill}
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleNextMonth}
              disabled={isNextDisabled}
              className="h-[2.8rem] w-[2.8rem] items-center justify-center rounded-full"
              style={{ backgroundColor: arrowBg, opacity: isNextDisabled ? 0.35 : 1 }}
            >
              <ChevronRightIcon
                size={14}
                fill={arrowIconFill}
              />
            </Pressable>
          </View>
        )}
      </View>

      <View className="relative">
        <Calendar
          key={calendarKey}
          current={visibleDate}
          minDate={minAvailableDate}
          maxDate={maxAvailableDate}
          markedDates={markedDates}
          markingType={markingType}
          onDayPress={onDayPress}
          onMonthChange={handleCalendarMonthChange}
          hideArrows
          hideExtraDays={hideExtraDays}
          showSixWeeks={showSixWeeks}
          renderHeader={() => null}
          theme={calendarTheme}
          firstDay={firstDay}
          dayComponent={dayComponent}
        />

        {isPickerOpen ? (
          <OutsidePressBackdrop
            open
            onOutsidePress={handleClosePicker}
          >
            <View className="absolute inset-0 z-10 items-center justify-start bg-role-surface-panel pt-[1rem] dark:bg-role-dark-surface-panel">
              <YearMonthPopover
                value={{ year: parsedVisible.year, month: parsedVisible.month }}
                minYear={effectiveMinYear}
                maxYear={effectiveMaxYear}
                availableYearMonths={availableYearMonths}
                onConfirm={handleConfirmYearMonth}
              />
            </View>
          </OutsidePressBackdrop>
        ) : null}
      </View>
    </View>
  );
}

export default CustomCalendar;
