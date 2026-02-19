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
