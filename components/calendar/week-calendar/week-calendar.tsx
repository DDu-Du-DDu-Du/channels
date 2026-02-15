import React from "react";
import { WeekCalendar as BaseWeekCalendar } from "react-native-calendars";

type WeekCalendarProps = React.ComponentProps<typeof BaseWeekCalendar>;

function WeekCalendar(props: WeekCalendarProps) {
  return <BaseWeekCalendar {...props} />;
}

export type { WeekCalendarProps };
export default WeekCalendar;
