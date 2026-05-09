import { useMemo } from "react";
import { View } from "react-native";
import { DateData } from "react-native-calendars";
import { MarkingTypes } from "react-native-calendars/src/types";

import CustomCalendar from "@/components/calendar/custom-calendar/custom-calendar";
import FormHeader from "@/components/form-header/form-header";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { formatDateToYYYYMMDD } from "@/utils";

export interface BottomMultipleCalendarProps {
  selected?: Date[];
  setSelected?: (dates: Date[] | undefined) => void;
  markedDates?: Record<string, any>;
  disableDayPress?: boolean;
  current?: string;
  monthLabel?: string;
  markingType?: MarkingTypes;
  showArrow?: boolean;
  hideArrow?: boolean;
  availableYearMonths?: string[];
  onMonthChange?: (date: DateData) => void;
  onPressBack?: () => void;
}

function BottomMultipleCalendar({
  selected = [],
  setSelected,
  markedDates,
  disableDayPress = false,
  current,
  monthLabel,
  markingType,
  showArrow = true,
  hideArrow = false,
  availableYearMonths,
  onMonthChange,
  onPressBack,
}: BottomMultipleCalendarProps) {
  const arrowIconFill = useThemeColorToken("ui.arrow.icon");

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

  const hideArrows = hideArrow || !showArrow;

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
      <CustomCalendar
        current={current}
        markedDates={resolvedMarkedDates}
        markingType={markingType}
        onDayPress={handleDayPress}
        onMonthChange={onMonthChange}
        hideExtraDays={false}
        hideArrows={hideArrows}
        availableYearMonths={availableYearMonths}
        monthLabel={monthLabel}
      />
    </View>
  );
}

export default BottomMultipleCalendar;
