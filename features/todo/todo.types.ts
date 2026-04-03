export interface TodoEditorReminderType {
  id?: number;
  remindsAt: string;
  remindedAt?: string | null;
}

export interface TodoEditorStateType {
  title: string;
  scheduledOn: string;
  detailOpen: boolean;
  beginAt: string;
  endAt: string;
  isBeginTimeEnabled: boolean;
  isEndTimeEnabled: boolean;
  reminders: TodoEditorReminderType[];
  memo: string;
}

export interface TodoEditorSubmitPayloadType {
  title: string;
  scheduledOn: string;
  beginAt: string;
  endAt: string;
  isBeginTimeEnabled: boolean;
  isEndTimeEnabled: boolean;
  reminders: TodoEditorReminderType[];
  memo: string;
}
