export interface DDuDuTimeType {
  beginAt: string | null;
  endAt: string | null;
}

export interface DDuDuTimeRangeType {
  beginHour: number;
  beginMin: number;
  endHour: number;
  endMin: number;
  isBeginTimeEnabled: boolean;
  isEndTimeEnabled: boolean;
}
