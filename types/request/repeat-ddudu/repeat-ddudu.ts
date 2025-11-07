import {
  DayOfMonth,
  DayOfWeek,
  RepeatDDuDusDateType,
} from "@/types/response/repeat-ddudu/repeat-ddudu";

export interface RepeatDduduRequestType {
  name: string;
  repeatType: RepeatDDuDusDateType;
  repeatDaysOfWeek?: DayOfWeek[];
  repeatDaysOfMonth?: DayOfMonth[];
  lastDayOfMonth?: boolean;
  startDate: string;
  endDate: string;
  beginAt?: string;
  endAt?: string;
}
