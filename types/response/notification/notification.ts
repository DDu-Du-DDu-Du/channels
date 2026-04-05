export type NotificationContextType = "Todo" | "ANNOUNCEMENT" | string;

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
  hasNext: boolean;
}

export interface NotificationInboxStatusType {
  hasNew: boolean;
}

export interface NotificationReadResponseType {
  context: string;
  contextId: number;
}
