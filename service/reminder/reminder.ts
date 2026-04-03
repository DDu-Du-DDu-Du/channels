import { fetchApi } from "@/api";
import { REMINDER } from "@/constants/end-points";
import type {
  CreateReminderRequestType,
  UpdateReminderRequestType,
} from "@/types/request/reminder/reminder";
import type {
  ReminderIdResponseType,
  RetrieveReminderResponseType,
} from "@/types/response/reminder/reminder";

interface GetReminderListProps {
  todoId: number;
  includeSent?: boolean;
}

export const getReminderList = async ({
  todoId,
  includeSent = false,
}: GetReminderListProps): Promise<RetrieveReminderResponseType[]> => {
  const response = await fetchApi(`${REMINDER.REMINDER}?todoId=${todoId}`, { method: "GET" }, true);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reminders = (await response.json()) as RetrieveReminderResponseType[];
  if (includeSent) {
    return reminders;
  }

  return reminders.filter((reminder) => !reminder.remindedAt);
};

interface CreateReminderProps {
  requestReminder: CreateReminderRequestType;
}

export const createReminder = async ({
  requestReminder,
}: CreateReminderProps): Promise<ReminderIdResponseType> => {
  const response = await fetchApi(
    REMINDER.REMINDER,
    {
      method: "POST",
      body: JSON.stringify(requestReminder),
    },
    true,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

interface UpdateReminderProps {
  id: number;
  requestReminder: UpdateReminderRequestType;
}

export const updateReminder = async ({ id, requestReminder }: UpdateReminderProps) => {
  const response = await fetchApi(
    `${REMINDER.REMINDER}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(requestReminder),
    },
    true,
  );

  if (response.status !== 204) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.status;
};

export const deleteReminder = async (id: number) => {
  const response = await fetchApi(`${REMINDER.REMINDER}/${id}`, { method: "DELETE" }, true);

  if (response.status !== 204) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.status;
};
