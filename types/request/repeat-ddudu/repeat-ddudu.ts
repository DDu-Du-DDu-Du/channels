import type { DayOfWeek, DayOfWeekKr } from "@/types/common/day-of-week";
import { DayOfMonth, RepeatDDuDusDateType } from "@/types/response/repeat-ddudu/repeat-ddudu";

export type RepeatDayOfWeek = DayOfWeek | DayOfWeekKr;

export interface RepeatDduduRequestType {
  name: string;
  repeatType: RepeatDDuDusDateType;
  repeatDaysOfWeek?: RepeatDayOfWeek[];
  repeatDaysOfMonth?: DayOfMonth[];
  lastDayOfMonth?: boolean;
  startDate: string;
  endDate: string;
  beginAt?: string;
  endAt?: string;
}

export interface RepeatDduduCreateRequestType extends RepeatDduduRequestType {
  goalId: number;
}
