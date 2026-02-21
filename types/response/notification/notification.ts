export type NotificationContextType = "DDUDU" | "ANNOUNCEMENT" | string;

export interface NotificationInboxItemType {
  id: number;
  senderId: number;
  isFromSystem: boolean;
  context: NotificationContextType;
  contextId: number;
  isRead: boolean;
  createdAt: string;
  title: string;
  body: string;
}

export interface NotificationInboxResponseType {
  isEmpty: boolean;
  contents: NotificationInboxItemType[];
  nextCursor: string | null;
}

export interface NotificationReadResponseType {
  context: string;
  contextId: number;
}
