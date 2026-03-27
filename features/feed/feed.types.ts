export interface TodoTimeType {
  beginAt: string | null;
  endAt: string | null;
}

export interface TodoTimeRangeType {
  beginHour: number;
  beginMin: number;
  endHour: number;
  endMin: number;
  isBeginTimeEnabled: boolean;
  isEndTimeEnabled: boolean;
}
