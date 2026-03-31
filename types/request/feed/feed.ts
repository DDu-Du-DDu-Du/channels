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
  remindDays?: number;
  remindHours?: number;
  remindMinutes?: number;
}

export interface RequestTodoChangeDate {
  newDate: string;
}

export interface RequestTodoReminder {
  days: number;
  hours: number;
  minutes: number;
}
