import { useMemo } from "react";
import { View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { MarkingTypes, Theme } from "react-native-calendars/src/types";

import { SpoqaText } from "@/components";
import { useCalendarFirstDay } from "@/hooks";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";
import { formatDateToYYYYMMDD } from "@/utils";

export interface BottomMultipleCalendarProps {
  selected?: Date[];
  setSelected?: (dates: Date[] | undefined) => void;
  markedDates?: Record<string, any>;
  disableDayPress?: boolean;
  monthLabel?: string;
  markingType?: MarkingTypes;
  showArrow?: boolean;
  hideArrow?: boolean;
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
}: BottomMultipleCalendarProps) {
  const firstDay = useCalendarFirstDay();
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
      <Calendar
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
              fill="#000"
            />
          ) : (
            <ChevronRightIcon
              size={20}
              fill="#000"
            />
          );
        }}
        renderHeader={(date) => (
          <SpoqaText className="text-size15">
            {monthLabel ??
              `${date?.getFullYear?.() ?? new Date().getFullYear()}년 ${(date?.getMonth?.() ?? new Date().getMonth()) + 1}월`}
          </SpoqaText>
        )}
        hideExtraDays={false}
        firstDay={firstDay}
        theme={
          {
            textSectionTitleColor: "#000",
            "stylesheet.calendar.header": {
              dayTextAtIndex0: {
                color: "red",
              },
              dayTextAtIndex6: {
                color: "blue",
              },
            },
          } as Theme
        }
      />
    </View>
  );
}

export default BottomMultipleCalendar;
