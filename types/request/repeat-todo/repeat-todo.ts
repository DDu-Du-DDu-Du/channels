import type { DayOfWeek, DayOfWeekKr } from "@/types/common/day-of-week";
import { DayOfMonth, RepeatTodosDateType } from "@/types/response/repeat-todo/repeat-todo";

export type RepeatDayOfWeek = DayOfWeek | DayOfWeekKr;

export interface RepeatTodoRequestType {
  name: string;
  repeatType: RepeatTodosDateType;
  repeatDaysOfWeek?: RepeatDayOfWeek[];
  repeatDaysOfMonth?: DayOfMonth[];
  lastDayOfMonth?: boolean;
  startDate: string;
  endDate: string;
  beginAt?: string;
  endAt?: string;
}

export interface RepeatTodoCreateRequestType extends RepeatTodoRequestType {
  goalId: number;
}
