export interface TodoDetailType {
  id: number;
  name: string;
  memo?: string;
  status: "UNCOMPLETED" | "COMPLETE";
  goalId: number;
  repeatTodoId?: number;
  scheduledOn: string;
  beginAt: string | null;
  endAt: string | null;
  reminders?: {
    id: number;
    remindsAt: string;
    remindedAt?: string | null;
  }[];
}
