import type { DayOfWeek, DayOfWeekKr } from "@/types/common/day-of-week";
import type { RepeatDayOfWeek } from "@/types/request/repeat-ddudu/repeat-ddudu";

export const WEEK_DAY_TO_KR: Record<DayOfWeek, DayOfWeekKr> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

export const WEEK_DAY_KR_TO_EN: Record<DayOfWeekKr, DayOfWeek> = {
  월: "MONDAY",
  화: "TUESDAY",
  수: "WEDNESDAY",
  목: "THURSDAY",
  금: "FRIDAY",
  토: "SATURDAY",
  일: "SUNDAY",
};

export const normalizeDayOfWeekToKr = (day: RepeatDayOfWeek): DayOfWeekKr => {
  if (day in WEEK_DAY_TO_KR) {
    return WEEK_DAY_TO_KR[day as DayOfWeek];
  }

  return day as DayOfWeekKr;
};

export const normalizeDayOfWeekToEn = (day: RepeatDayOfWeek): DayOfWeek => {
  if (day in WEEK_DAY_KR_TO_EN) {
    return WEEK_DAY_KR_TO_EN[day as DayOfWeekKr];
  }

  return day as DayOfWeek;
};
