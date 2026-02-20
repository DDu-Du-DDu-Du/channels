export interface StatsYearMonthRequest {
  yearMonth: string;
}

export interface StatsGoalDetailRequest {
  goalId: number;
  fromMonth: string;
  toMonth: string;
}
