export interface DDuDuEditorReminderType {
  enabled: boolean;
  day: number;
  hour: number;
  minute: number;
}

export interface DDuDuEditorStateType {
  title: string;
  scheduledOn: string;
  detailOpen: boolean;
  beginAt: string;
  endAt: string;
  isBeginTimeEnabled: boolean;
  isEndTimeEnabled: boolean;
  reminder: DDuDuEditorReminderType;
  memo: string;
}

export interface DDuDuEditorSubmitPayloadType {
  title: string;
  scheduledOn: string;
  beginAt: string;
  endAt: string;
  isBeginTimeEnabled: boolean;
  isEndTimeEnabled: boolean;
  reminder: DDuDuEditorReminderType;
  memo: string;
}
