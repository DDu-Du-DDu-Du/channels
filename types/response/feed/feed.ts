type MainGoalType = {
  id: number;
  name: string;
  color: string;
  status: "IN_PROGRESS" | "DONE";
  priority: number;
};

export type MainTodosType = {
  id: number;
  name: string;
  status: "COMPLETE" | "UNCOMPLETED";
};

export interface MainDailyListType {
  goal: MainGoalType;
  todos: MainTodosType[];
  Todos?: MainTodosType[];
}

export interface MonthlyWeeklyTodoType {
  date: string;
  totalCount: number;
  completedCount?: number;
  uncompletedCount: number;
}

export interface MainDailyTimeTableType {
  timetable: MainTimeTableType[];
  unassignedTodos: MainDailyListType[];
}

export type MainTimeTableType = {
  beginAt: string;
  todos: MainTimeTableTodoType[];
  Todos?: MainTimeTableTodoType[];
};

export interface MainTimeTableTodoType {
  id: number;
  name: string;
  status: "COMPLETE" | "UNCOMPLETED";
  goalId: number;
  beginAt?: string;
  endAt?: string;
  color: string;
}

export interface GoalMemoType {
  id: number;
  contents: string;
  type: "WEEK" | "MONTH";
}
