import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Theme } from "react-native-calendars/src/types";

import { PeriodType } from "@/components/period-goal-memo/period-goal-memo";
import type { MonthlyGoalMemoType, MonthlyWeeklyDDuDuType } from "@/types/response/feed/feed";
import { formatDateToYYYYMMDD } from "@/utils";

import FeedCalendarDayContent from "./components/feed-calendar-day-content/feed-calendar-day-content";
import FeedCalendarHeader from "./components/feed-calendar-header/feed-calendar-header";
import useFeedCalendar from "./hooks/use-feed-calendar/use-feed-calendar";
import useGoalsDDuDuMutation from "./hooks/use-goals-ddudu-mutation/use-goals-ddudu-mutation";

export interface FeedCalendarProps {
  type?: PeriodType;
  monthlyDDuDus: MonthlyWeeklyDDuDuType[];
  periodGoalMemo?: MonthlyGoalMemoType;
  onSelectDate: (date: string) => void;
}

function FeedCalendar({
  type = "MONTH",
  monthlyDDuDus,
  periodGoalMemo,
  onSelectDate,
}: FeedCalendarProps) {
  const today = formatDateToYYYYMMDD(new Date());
  const { selectedDate, handleSelectDate } = useFeedCalendar({ today, onSelectDate });
  const { yearMonth, handleMonthChange } = useGoalsDDuDuMutation({
    date: today,
  });

  return (
    <View className="items-center px-4 py-2 w-full gap-2">
      <FeedCalendarHeader
        yearMonth={yearMonth}
        type={type}
        periodGoalMemo={periodGoalMemo}
      />
      <View className="w-full">
        <Calendar
          current={selectedDate}
          monthFormat="yyyy년 MM월"
          dayComponent={({ date, state }) => {
            return (
              <FeedCalendarDayContent
                today={today}
                date={date?.dateString ?? ""}
                day={date?.day}
                monthlyWeeklyDDuDuType={monthlyDDuDus}
                selectedDate={selectedDate}
                onPress={handleSelectDate}
                disabled={state === "disabled"}
              />
            );
          }}
          onMonthChange={handleMonthChange}
          hideExtraDays={false}
          theme={
            {
              weekVerticalMargin: 0,
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
    </View>
  );
}

export default FeedCalendar;
