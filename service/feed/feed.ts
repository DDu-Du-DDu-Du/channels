import { fetchApi } from "@/api";
import { FEED } from "@/constants/end-points";
import { TodoTimeType } from "@/features/feed/feed.types";
import {
  RequestPeriodGoalMemo,
  RequestTodo,
  RequestTodoChangeDate,
} from "@/types/request/feed/feed";

interface GetDailyListProps {
  userId: number;
  date: string;
}

export const getDailyList = async ({ userId, date }: GetDailyListProps) => {
  const selectedDate = `&date=${date}`;

  const response = await fetchApi(
    `${FEED.DAILY_LIST}?userId=${userId}${selectedDate}`,
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

export const getDailyTimeTable = async ({ userId, date }: GetDailyListProps) => {
  const response = await fetchApi(
    `${FEED.DAILY_TIMETABLE}?userId=${userId}&date=${date}`,
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

interface PeriodGoalsProps {
  type: "WEEK" | "MONTH";
  date: string;
}

export const getGoals = async ({ type, date }: PeriodGoalsProps) => {
  const selectedDate = `&date=${date}`;

  const response = await fetchApi(
    `${FEED.PERIOD_GOALS}?type=${type}${selectedDate}`,
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

interface FetchCreateGoalsProps {
  periodGoals: RequestPeriodGoalMemo;
}

export const fetchCreateGoals = async ({ periodGoals }: FetchCreateGoalsProps) => {
  const response = await fetchApi(
    `${FEED.PERIOD_GOALS}`,
    {
      method: "POST",
      body: JSON.stringify(periodGoals),
    },
    true,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

interface FetchEditGoalsProps {
  contents: string;
  periodGoalsId: number;
}

export const fetchEditGoals = async ({ contents, periodGoalsId }: FetchEditGoalsProps) => {
  const response = await fetchApi(
    `${FEED.PERIOD_GOALS}/${periodGoalsId}`,
    {
      method: "PUT",
      body: JSON.stringify({ contents }),
    },
    true,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getWeeklyTodos = async ({ userId, date }: GetDailyListProps) => {
  return getPeriodTodos({ userId, date, type: "WEEK" });
};

export const getMonthlyTodos = async ({ userId, date }: GetDailyListProps) => {
  return getPeriodTodos({ userId, date, type: "MONTH" });
};

interface GetPeriodTodosProps extends GetDailyListProps {
  type: "WEEK" | "MONTH";
}

export const getPeriodTodos = async ({ userId, date, type }: GetPeriodTodosProps) => {
  const selectedDate = `&date=${date}`;
  const endpoint = type === "WEEK" ? FEED.WEEKLY_TODOS : FEED.MONTHLY_TODOS;

  const response = await fetchApi(
    `${endpoint}?userId=${userId}${selectedDate}`,
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

export const getTodoDetail = async ({ id }: FetchUpdateTodoProps) => {
  const response = await fetchApi(`${FEED.TODO}/${id}`, { method: "GET" }, true);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

interface FetchCreateTodoProps {
  requestTodo: RequestTodo;
}

export const fetchCreateTodo = async ({ requestTodo }: FetchCreateTodoProps) => {
  const response = await fetchApi(
    `${FEED.TODO}`,
    {
      method: "POST",
      body: JSON.stringify(requestTodo),
    },
    true,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

interface FetchEditTodoProps {
  id: number;
  requestTodo: RequestTodo;
}

export const fetchEditTodo = async ({ id, requestTodo }: FetchEditTodoProps) => {
  const response = await fetchApi(
    `${FEED.TODO}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(requestTodo),
    },
    true,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

interface FetchUpdateTodoProps {
  id: number;
}

export const fetchDeleteTodo = async ({ id }: FetchUpdateTodoProps) => {
  const response = await fetchApi(`${FEED.TODO}/${id}`, { method: "DELETE" }, true);

  if (response.status === 204) {
    return response.status;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const fetchCompleteToggleTodo = async ({ id }: FetchUpdateTodoProps) => {
  const response = await fetchApi(`${FEED.TODO}/${id}/status`, { method: "PATCH" }, true);

  if (response.status !== 204) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

interface fetchTodoDateProps {
  id: number;
  date: string;
}

export const fetchTodoChangeDate = async ({ id, date }: fetchTodoDateProps) => {
  const changedDate: RequestTodoChangeDate = { newDate: date };

  const response = await fetchApi(
    `${FEED.TODO}/${id}/date`,
    {
      method: "PUT",
      body: JSON.stringify(changedDate),
    },
    true,
  );

  if (response.status !== 204) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.status;
};

export const fetchTodoRepeatDate = async ({ id, date }: fetchTodoDateProps) => {
  const response = await fetchApi(
    `${FEED.TODO}/${id}/repeat`,
    {
      method: "POST",
      body: JSON.stringify({ repeatOn: date }),
    },
    true,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

interface FetchTodoChangeTimeProps {
  time: TodoTimeType;
  id: number;
}

export const fetchTodoChangeTime = async ({ time, id }: FetchTodoChangeTimeProps) => {
  const response = await fetchApi(
    `${FEED.TODO}/${id}/period`,
    {
      method: "PUT",
      body: JSON.stringify(time),
    },
    true,
  );

  if (response.status !== 204) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.status;
};
