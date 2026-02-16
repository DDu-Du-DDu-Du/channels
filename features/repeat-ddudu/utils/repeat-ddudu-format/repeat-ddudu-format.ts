import type { DayOfWeek } from "@/types/common/day-of-week";
import type { RepeatDDuDusType } from "@/types/response/repeat-ddudu/repeat-ddudu";

import type { RepeatDduduItemType } from "../../repeat-ddudu.types";

const KR_TO_DAY_OF_WEEK: Record<string, DayOfWeek> = {
  월: "MONDAY",
  화: "TUESDAY",
  수: "WEDNESDAY",
  목: "THURSDAY",
  금: "FRIDAY",
  토: "SATURDAY",
  일: "SUNDAY",
};

const WEEK_DAY_LABEL: Record<DayOfWeek, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

const REPEAT_TYPE_LABEL: Record<RepeatDduduItemType["repeatType"], string> = {
  DAILY: "매일",
  WEEKLY: "매주",
  MONTHLY: "매월",
};

const ensureRepeatType = (repeatType?: string): RepeatDduduItemType["repeatType"] => {
  if (repeatType === "WEEKLY" || repeatType === "MONTHLY") {
    return repeatType;
  }

  return "DAILY";
};

const normalizeRepeatDaysOfWeek = (days: unknown): DayOfWeek[] | undefined => {
  if (!Array.isArray(days)) {
    return undefined;
  }

  const normalizedDays = days
    .map((day) => {
      if (typeof day !== "string") {
        return undefined;
      }

      if (day in KR_TO_DAY_OF_WEEK) {
        return KR_TO_DAY_OF_WEEK[day];
      }

      if (day in WEEK_DAY_LABEL) {
        return day as DayOfWeek;
      }

      return undefined;
    })
    .filter((day): day is DayOfWeek => Boolean(day));

  return normalizedDays.length ? normalizedDays : undefined;
};

export const mapRepeatDduduResponseToItem = (
  repeatDdudu: RepeatDDuDusType,
): RepeatDduduItemType => {
  const repeatPattern = repeatDdudu.repeatPattern;
  const patternInfo = repeatPattern.info;
  const repeatType = ensureRepeatType(repeatPattern.repeatType ?? patternInfo?.repeatType);
  const repeatDaysOfMonthRaw = repeatPattern.repeatDaysOfMonth ?? patternInfo?.repeatDaysOfMonth;
  const repeatDaysOfMonth = Array.isArray(repeatDaysOfMonthRaw)
    ? repeatDaysOfMonthRaw.map((day) => Number(day))
    : undefined;

  return {
    id: repeatDdudu.id,
    name: repeatDdudu.name,
    repeatType,
    repeatDaysOfWeek: normalizeRepeatDaysOfWeek(
      repeatPattern.repeatDaysOfWeek ?? patternInfo?.repeatDaysOfWeek,
    ),
    repeatDaysOfMonth: repeatDaysOfMonth as RepeatDduduItemType["repeatDaysOfMonth"],
    lastDayOfMonth: Boolean(repeatPattern.lastDay ?? patternInfo?.lastDayOfMonth),
    startDate: repeatDdudu.startDate,
    endDate: repeatDdudu.endDate,
    beginAt: repeatDdudu.beginAt,
    endAt: repeatDdudu.endAt,
  };
};

const formatDate = (date: string) => date.replaceAll("-", ".");

const formatMonthlyDays = (repeatDdudu: RepeatDduduItemType) => {
  const days = [...(repeatDdudu.repeatDaysOfMonth ?? [])]
    .sort((a, b) => Number(a) - Number(b))
    .map((day) => String(day));

  if (repeatDdudu.lastDayOfMonth) {
    days.push("마지막날");
  }

  if (days.length > 10) {
    return `${days.slice(0, 10).join(" ")} ...`;
  }

  return days.join(" ");
};

export const buildRepeatDduduDescription = (repeatDdudu: RepeatDduduItemType) => {
  const parts: string[] = [REPEAT_TYPE_LABEL[repeatDdudu.repeatType]];

  if (repeatDdudu.repeatType === "WEEKLY" && repeatDdudu.repeatDaysOfWeek?.length) {
    parts.push(repeatDdudu.repeatDaysOfWeek.map((day) => WEEK_DAY_LABEL[day]).join(" "));
  }

  if (repeatDdudu.repeatType === "MONTHLY") {
    const monthlyDays = formatMonthlyDays(repeatDdudu);
    if (monthlyDays) {
      parts.push(monthlyDays);
    }
  }

  parts.push(`${formatDate(repeatDdudu.startDate)} ~ ${formatDate(repeatDdudu.endDate)}`);

  return parts.join(" | ");
};
