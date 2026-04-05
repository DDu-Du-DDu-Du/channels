import { useMemo } from "react";
import { View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { MarkingTypes } from "react-native-calendars/src/types";

import FormHeader from "@/components/form-header/form-header";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { useCalendarFirstDay } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";
import { useSettingsStore } from "@/stores";
import { formatDateToYYYYMMDD, getCalendarTheme } from "@/utils";

export interface BottomMultipleCalendarProps {
  selected?: Date[];
  setSelected?: (dates: Date[] | undefined) => void;
  markedDates?: Record<string, any>;
  disableDayPress?: boolean;
  monthLabel?: string;
  markingType?: MarkingTypes;
  showArrow?: boolean;
  hideArrow?: boolean;
  onPressBack?: () => void;
}

function BottomMultipleCalendar({
  selected = [],
  setSelected,
  markedDates,
  disableDayPress = false,
  monthLabel,
  markingType,
  showArrow = true,
  hideArrow = false,
  onPressBack,
}: BottomMultipleCalendarProps) {
  const firstDay = useCalendarFirstDay();
  const isDarkMode = useSettingsStore((state) => state.display.isDarkMode);
  const arrowIconFill = useThemeColorToken("ui.arrow.icon");
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
    () => `bottom-multiple-${firstDay}-${isDarkMode ? "dark" : "light"}`,
    [firstDay, isDarkMode],
  );
  const fallbackMarkedDates = selected.reduce<Record<string, { selected: boolean }>>(
    (acc, date) => {
      acc[formatDateToYYYYMMDD(date)] = { selected: true };
      return acc;
    },
    {},
  );

  const resolvedMarkedDates = useMemo(() => {
    if (!markedDates) {
      return fallbackMarkedDates;
    }

    const merged = { ...markedDates };

    selected.forEach((date) => {
      const key = formatDateToYYYYMMDD(date);
      merged[key] = {
        ...(merged[key] ?? {}),
        selected: true,
      };
    });

    return merged;
  }, [fallbackMarkedDates, markedDates, selected]);

  const handleDayPress = (day: DateData) => {
    if (disableDayPress || !setSelected) {
      return;
    }

    const key = day.dateString;
    const exists = selected.some((date) => formatDateToYYYYMMDD(date) === key);

    if (exists) {
      const next = selected.filter((date) => formatDateToYYYYMMDD(date) !== key);
      setSelected(next.length ? next : undefined);
      return;
    }

    setSelected([...selected, new Date(key)]);
  };

  const shouldRenderArrow = !hideArrow && showArrow;

  return (
    <View className="w-full">
      {onPressBack ? (
        <FormHeader
          title=""
          onPressBack={onPressBack}
          iconStroke={arrowIconFill}
          titleClassName="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
          className="px-[0.4rem] pb-[0.2rem] pt-[0.2rem]"
        />
      ) : null}
      <Calendar
        key={calendarKey}
        markedDates={resolvedMarkedDates}
        markingType={markingType}
        onDayPress={handleDayPress}
        monthFormat="yyyy년 MM월"
        renderArrow={(direction) => {
          if (!shouldRenderArrow) {
            return <View className="size-[2rem]" />;
          }

          return direction === "left" ? (
            <ChevronLeftIcon
              size={20}
              fill={arrowIconFill}
            />
          ) : (
            <ChevronRightIcon
              size={20}
              fill={arrowIconFill}
            />
          );
        }}
        renderHeader={(date) => (
          <SpoqaText className="text-size15 text-role-text-primary dark:text-role-dark-text-primary">
            {monthLabel ??
              `${date?.getFullYear?.() ?? new Date().getFullYear()}년 ${(date?.getMonth?.() ?? new Date().getMonth()) + 1}월`}
          </SpoqaText>
        )}
        hideExtraDays={false}
        firstDay={firstDay}
        theme={calendarTheme}
      />
    </View>
  );
}

export default BottomMultipleCalendar;
