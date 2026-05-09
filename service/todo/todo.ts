import { fetchApi } from "@/api";
import { TODO } from "@/constants/end-points";
import { isGuestSession } from "@/service/guest-storage/guest-session";
import { getGuestTodoDashboard, searchGuestTodos } from "@/service/guest-storage/guest-storage";
import type { TodoDashboardResponseType, TodosearchResponseType } from "@/types/response/todo/todo";
import { getClientTimeZone } from "@/utils";

interface GetTodosearchProps {
  query: string;
  size?: number;
  cursor?: string | null;
}

export const getTodosearch = async ({
  query,
  size = 20,
  cursor = null,
}: GetTodosearchProps): Promise<TodosearchResponseType> => {
  if (isGuestSession()) {
    return searchGuestTodos({ query, size, cursor });
  }

  const queryParams = new URLSearchParams({
    query,
    size: String(size),
    timeZone: getClientTimeZone(),
  });

  if (cursor) {
    queryParams.set("cursor", cursor);
  }

  const response = await fetchApi(
    `${TODO.SEARCH}?${queryParams.toString()}`,
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

export const getTodoSearch = getTodosearch;

export const getTodoDashboard = async (): Promise<TodoDashboardResponseType> => {
  if (isGuestSession()) {
    return getGuestTodoDashboard();
  }

  const response = await fetchApi(
    `${TODO.DASHBOARD}?${new URLSearchParams({ timeZone: getClientTimeZone() }).toString()}`,
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
