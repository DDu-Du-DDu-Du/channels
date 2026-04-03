export interface RequestPeriodGoalMemo {
  contents: string;
  type: "WEEK" | "MONTH";
  planDate: string;
}

export interface RequestTodo {
  goalId: number;
  name: string;
  memo?: string;
  scheduledOn: string;
  beginAt?: string;
  endAt?: string;
  reminders?: {
    id?: number;
    remindsAt: string;
  }[];
}

export interface RequestTodoChangeDate {
  newDate: string;
}
