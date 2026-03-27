export interface TodoEditorReminderType {
  enabled: boolean;
  day: number;
  hour: number;
  minute: number;
}

export interface TodoEditorStateType {
  title: string;
  scheduledOn: string;
  detailOpen: boolean;
  beginAt: string;
  endAt: string;
  isBeginTimeEnabled: boolean;
  isEndTimeEnabled: boolean;
  reminder: TodoEditorReminderType;
  memo: string;
}

export interface TodoEditorSubmitPayloadType {
  title: string;
  scheduledOn: string;
  beginAt: string;
  endAt: string;
  isBeginTimeEnabled: boolean;
  isEndTimeEnabled: boolean;
  reminder: TodoEditorReminderType;
  memo: string;
}
