import type { DayOfWeek } from "@/types/common/day-of-week";

export type { DayOfWeek } from "@/types/common/day-of-week";

export interface RepeatDDuDusType {
  id: number;
  name: string;
  repeatPattern: RepeatDDuDusPattern;
  startDate: string;
  endDate: string;
  beginAt?: string;
  endAt?: string;
}

export interface RepeatDDuDusPattern {
  repeatType: RepeatDDuDusDateType;
  repeatDaysOfWeek?: DayOfWeek[];
  repeatDaysOfMonth?: DayOfMonth[];
  lastDay?: boolean;
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

export type RepeatDDuDusDateType = "DAILY" | "WEEKLY" | "MONTHLY";
