export interface CreateReminderRequestType {
  todoId: number;
  remindsAt: string;
}

export interface UpdateReminderRequestType {
  remindsAt: string;
}
