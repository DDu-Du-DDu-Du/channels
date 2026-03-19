import type { Theme } from "react-native-calendars/src/types";

function getWeekendHeaderTheme(firstDay: number): Theme {
  const normalizedFirstDay = ((firstDay % 7) + 7) % 7;
  const sundayIndex = (7 - normalizedFirstDay) % 7;
  const saturdayIndex = (6 - normalizedFirstDay + 7) % 7;

  return {
    "stylesheet.calendar.header": {
      [`dayTextAtIndex${sundayIndex}`]: {
        color: "red",
      },
      [`dayTextAtIndex${saturdayIndex}`]: {
        color: "blue",
      },
    },
  } as Theme;
}

export default getWeekendHeaderTheme;
