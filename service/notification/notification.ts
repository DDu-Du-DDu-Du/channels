import { fetchApi } from "@/api";
import { NOTIFICATION } from "@/constants/end-points";
import type {
  NotificationInboxResponseType,
  NotificationInboxStatusType,
  NotificationReadResponseType,
} from "@/types/response/notification/notification";

interface GetNotificationInboxProps {
  size?: number;
  cursor?: string | null;
}

export const getNotificationInbox = async ({
  size = 20,
  cursor = null,
}: GetNotificationInboxProps): Promise<NotificationInboxResponseType> => {
  const queryParams = [`size=${size}`];

  if (cursor) {
    queryParams.push(`cursor=${encodeURIComponent(cursor)}`);
  }

  const response = await fetchApi(
    `${NOTIFICATION.INBOX}?${queryParams.join("&")}`,
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

export const getNotificationInboxStatus = async (): Promise<NotificationInboxStatusType> => {
  const response = await fetchApi(
    `${NOTIFICATION.STATUS}`,
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

interface PatchNotificationReadProps {
  id: number;
}

export const patchNotificationRead = async ({
  id,
}: PatchNotificationReadProps): Promise<NotificationReadResponseType> => {
  const response = await fetchApi(`${NOTIFICATION.READ}/${id}/read`, { method: "PATCH" }, true);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
