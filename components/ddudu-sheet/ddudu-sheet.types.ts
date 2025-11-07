export interface DDuDuDetailType {
  id: number;
  name: string;
  status: "UNCOMPLETED" | "COMPLETE";
  goalId: number;
  repeatDduduId: number;
  scheduledOn: string;
  beginAt: string | null;
  endAt: string | null;
}
