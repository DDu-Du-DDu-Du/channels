export interface StatsYearMonthType {
  year: number;
  month: string;
  monthValue: number;
  leapYear: boolean;
}

export interface StatsReportItemType {
  yearMonth: StatsYearMonthType;
  totalCount: number;
  achievementRate: number;
  sustenanceCount: number;
  postponementCount: number;
  reattainmentRate: number;
}

export interface StatsReportResponseType {
  lastMonth: StatsReportItemType;
  thisMonth: StatsReportItemType;
}

export interface StatsCreationCountType {
  goalId: number;
  goalName: string;
  goalColor?: string;
  count: number;
}

export interface StatsAchievementType {
  goalId: number;
  goalName: string;
  goalColor?: string;
  achievementRate: number;
}

export interface StatsPostponementType {
  goalId: number;
  goalName: string;
  goalColor?: string;
  postponementCount: number;
}

export interface StatsSustenanceType {
  goalId: number;
  goalName: string;
  goalColor?: string;
  sustenanceCount: number;
}

export interface StatsReattainmentType {
  goalId: number;
  goalName: string;
  goalColor?: string;
  reattainmentRate: number;
}

export interface StatsSummaryResponseType {
  creationCounts: StatsCreationCountType[];
  achievements: StatsAchievementType[];
  postponements: StatsPostponementType[];
  sustenances: StatsSustenanceType[];
  reattainments: StatsReattainmentType[];
}

export type StatsDayOfWeekType =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type StatsDayOfWeekMapType = Record<string, number>;

export interface StatsDetailDayOfWeekStatsType {
  mostActiveDays: StatsDayOfWeekType[];
  stats: StatsDayOfWeekMapType;
}

export interface StatsDetailCalendarItemType {
  date: string;
  totalCount: number;
  uncompletedCount: number;
}

export interface StatsDetailCalendarStatsType {
  isAvailable: boolean;
  stats: StatsDetailCalendarItemType[];
}

export interface StatsDetailRepeatDduduItemType {
  repeatDduduId: number;
  repeatDduduName: string;
  completedCount: number;
  totalCount: number;
}

export interface StatsGoalAchievedOverviewType {
  achievementCount: number;
  totalCount: number;
  achievementRate: number;
  mostAchievedTime: "AM" | "PM" | string;
}

export interface StatsGoalAchievedDetailResponseType {
  goalId: number;
  overview: StatsGoalAchievedOverviewType;
  dayOfWeekStats: StatsDetailDayOfWeekStatsType;
  repeatDduduStats: StatsDetailRepeatDduduItemType[];
  calendarStats: StatsDetailCalendarStatsType;
}

export interface StatsGoalPostponedOverviewType {
  postponedCount: number;
  reattainedCount: number;
  totalCount: number;
  postponementRate: number;
  reattainmentRate: number;
}

export interface StatsGoalPostponedDetailResponseType {
  goalId: number;
  overview: StatsGoalPostponedOverviewType;
  dayOfWeekStats: StatsDetailDayOfWeekStatsType;
  calendarStats: StatsDetailCalendarStatsType;
}
