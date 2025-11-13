export interface RequestPeriodGoalMemo {
  contents: string;
  type: "WEEK" | "MONTH";
  planDate: string;
}

export interface RequestDDuDu {
  goalId: number;
  name: string;
  scheduledOn: string;
}

export interface RequestDDuDuChangeDate {
  newDate: string;
}
