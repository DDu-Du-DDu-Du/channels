export interface DDuDuSearchItemType {
  id: number;
  name: string;
  scheduledOn: string;
  status?: "COMPLETE" | "UNCOMPLETED";
}

export interface DDuDuSearchResponseType {
  isEmpty: boolean;
  contents: DDuDuSearchItemType[];
  nextCursor: string | null;
}
