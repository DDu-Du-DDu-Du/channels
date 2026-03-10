import { fetchApi } from "@/api";
import { ANNOUNCEMENT } from "@/constants/end-points";
import type {
  AnnouncementDetailResponseType,
  AnnouncementListResponseType,
} from "@/types/response/announcement/announcement";

interface GetAnnouncementsProps {
  size?: number;
  cursor?: string | null;
}

export const getAnnouncements = async ({
  size = 20,
  cursor = null,
}: GetAnnouncementsProps): Promise<AnnouncementListResponseType> => {
  const queryParams = [`size=${size}`];

  if (cursor) {
    queryParams.push(`cursor=${encodeURIComponent(cursor)}`);
  }

  const response = await fetchApi(
    `${ANNOUNCEMENT.ANNOUNCEMENTS}?${queryParams.join("&")}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    },
    true,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

interface GetAnnouncementDetailProps {
  id: number;
}

export const getAnnouncementDetail = async ({
  id,
}: GetAnnouncementDetailProps): Promise<AnnouncementDetailResponseType> => {
  const response = await fetchApi(`${ANNOUNCEMENT.ANNOUNCEMENTS}/${id}`, { method: "GET" }, true);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
