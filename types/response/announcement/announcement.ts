export interface AnnouncementListItemResponseType {
  id: number;
  title: string;
  author: string;
  createdAt: string;
}

export interface AnnouncementListResponseType {
  isEmpty: boolean;
  contents: AnnouncementListItemResponseType[];
  nextCursor: string | null;
}

export interface AnnouncementDetailResponseType {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  author: string;
}
