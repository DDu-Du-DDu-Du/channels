export interface RetrieveReminderResponseType {
  id: number;
  remindsAt: string;
  remindedAt?: string | null;
}

export interface ReminderIdResponseType {
  id: number;
}
