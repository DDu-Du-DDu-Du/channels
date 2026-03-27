import type { DayOfWeek } from "@/types/common/day-of-week";

export type { DayOfWeek } from "@/types/common/day-of-week";

export interface RepeatTodosType {
  id: number;
  name: string;
  repeatPattern: RepeatTodosPattern;
  startDate: string;
  endDate: string;
  beginAt?: string;
  endAt?: string;
}

export interface RepeatTodosPattern {
  repeatType?: RepeatTodosDateType;
  repeatDaysOfWeek?: DayOfWeek[];
  repeatDaysOfMonth?: DayOfMonth[];
  lastDay?: boolean;
  info?: {
    repeatType?: RepeatTodosDateType;
    repeatDaysOfWeek?: DayOfWeek[] | string[];
    repeatDaysOfMonth?: DayOfMonth[] | number[];
    lastDayOfMonth?: boolean;
  };
}

export type DayOfMonth =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31;

export type RepeatTodosDateType = "DAILY" | "WEEKLY" | "MONTHLY";
