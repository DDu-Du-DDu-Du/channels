import { fetchApi } from "@/api";
import { TODO } from "@/constants/end-points";
import { isGuestSession } from "@/service/guest-storage/guest-session";
import { getGuestTodoDashboard, searchGuestTodos } from "@/service/guest-storage/guest-storage";
import type { TodoDashboardResponseType, TodosearchResponseType } from "@/types/response/todo/todo";

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

  const queryParams = [`query=${encodeURIComponent(query)}`, `size=${size}`];

  if (cursor) {
    queryParams.push(`cursor=${encodeURIComponent(cursor)}`);
  }

  const response = await fetchApi(
    `${TODO.SEARCH}?${queryParams.join("&")}`,
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
    TODO.DASHBOARD,
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
