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
