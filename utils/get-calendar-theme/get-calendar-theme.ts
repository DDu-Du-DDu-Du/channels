import type { Theme } from "react-native-calendars/src/types";

import { type ThemeMode, type ThemeName, getThemeColorToken } from "@/constants/theme";

import getWeekendHeaderTheme from "../get-weekend-header-theme/get-weekend-header-theme";

interface GetCalendarThemeParams {
  themeName: ThemeName;
  mode: ThemeMode;
  firstDay: number;
}

type CalendarHeaderTheme = Theme & {
  "stylesheet.calendar.header"?: Record<string, object>;
};

function getCalendarTheme({ themeName, mode, firstDay }: GetCalendarThemeParams): Theme {
  const context = { themeName, mode };
  const headerTextColor = getThemeColorToken("role.text.secondary", context);
  const monthTextColor = getThemeColorToken("role.text.primary", context);
  const dayTextColor = getThemeColorToken("role.text.primary", context);
  const disabledTextColor = getThemeColorToken("role.text.tertiary", context);
  const todayTextColor = getThemeColorToken("role.status.info", context);
  const selectedDayBackgroundColor = getThemeColorToken("ui.button.choice.selected.bg", context);
  const selectedDayTextColor = getThemeColorToken("ui.button.choice.selected.text", context);
  const calendarBackground = getThemeColorToken("role.surface.panel", context);
  const arrowColor = getThemeColorToken("ui.arrow.icon", context);
  const weekendHeaderTheme = getWeekendHeaderTheme(firstDay) as CalendarHeaderTheme;

  return {
    backgroundColor: calendarBackground,
    calendarBackground,
    textSectionTitleColor: headerTextColor,
    monthTextColor,
    dayTextColor,
    textDisabledColor: disabledTextColor,
    todayTextColor,
    selectedDayBackgroundColor,
    selectedDayTextColor,
    arrowColor,
    "stylesheet.calendar.header": {
      dayHeader: {
        color: headerTextColor,
      },
      monthText: {
        color: monthTextColor,
      },
      ...((weekendHeaderTheme["stylesheet.calendar.header"] as Record<string, unknown>) ?? {}),
    },
  } as CalendarHeaderTheme;
}

export default getCalendarTheme;
