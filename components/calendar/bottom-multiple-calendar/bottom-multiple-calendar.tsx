import { View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { Theme } from "react-native-calendars/src/types";

import { SpoqaText } from "@/components";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";
import { formatDateToYYYYMMDD } from "@/utils";

export interface BottomMultipleCalendarProps {
  selected: Date[];
  setSelected: (dates: Date[] | undefined) => void;
}

function BottomMultipleCalendar({ selected, setSelected }: BottomMultipleCalendarProps) {
  const markedDates = selected?.reduce<Record<string, { selected: boolean }>>((acc, d) => {
    acc[formatDateToYYYYMMDD(d)] = { selected: true };

    return acc;
  }, {});

  const handleDayPress = (day: DateData) => {
    const key = day.dateString;
    const exists = selected?.some((d) => formatDateToYYYYMMDD(d) === key);
    if (exists) {
      const next = selected.filter((d) => formatDateToYYYYMMDD(d) !== key);
      setSelected(next.length ? next : undefined);
    } else {
      const next = [...(selected || []), new Date(key)];
      setSelected(next);
    }
  };

  return (
    <View className="w-full">
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        renderArrow={(direction) =>
          direction === "left" ? (
            <ChevronLeftIcon
              size={20}
              fill="#000"
            />
          ) : (
            <ChevronRightIcon
              size={20}
              fill="#000"
            />
          )
        }
        renderHeader={(date) => (
          <SpoqaText className="text-size15">{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</SpoqaText>
        )}
        hideExtraDays={false}
        firstDay={0}
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
