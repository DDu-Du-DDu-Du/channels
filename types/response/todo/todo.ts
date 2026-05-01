export interface TodosearchItemType {
  id: number;
  name: string;
  scheduledOn: string;
  status?: "COMPLETE" | "UNCOMPLETED";
}

export interface TodosearchResponseType {
  isEmpty: boolean;
  contents: TodosearchItemType[];
  nextCursor: string | null;
  hasNext: boolean;
}

export type TodoSearchItemType = TodosearchItemType;
export type TodoSearchResponseType = TodosearchResponseType;

export type TodoStatusType = "COMPLETE" | "UNCOMPLETED";

export interface TodoDashboardItemType {
  id: number;
  name: string;
  scheduledOn: string;
  beginAt?: string | null;
  endAt?: string | null;
  status: TodoStatusType;
  postponedAt?: string | null;
}

export interface TodoDashboardContentType {
  date: string;
  todos: TodoDashboardItemType[];
}

export interface TodoDashboardResponseType {
  isEmpty: boolean;
  contents: TodoDashboardContentType[];
  todayIndex: number;
}
