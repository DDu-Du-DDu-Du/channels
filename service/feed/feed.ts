import { fetchApi } from "@/api";
import { FEED } from "@/constants/end-points";
import { DDuDuTimeType } from "@/features/feed/feed.types";
import {
  RequestDDuDu,
  RequestDDuDuChangeDate,
  RequestPeriodGoalMemo,
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

export const getWeeklyDDuDus = async ({ userId, date }: GetDailyListProps) => {
  return getPeriodDDuDus({ userId, date, type: "WEEK" });
};

export const getMonthlyDDuDus = async ({ userId, date }: GetDailyListProps) => {
  return getPeriodDDuDus({ userId, date, type: "MONTH" });
};

interface GetPeriodDDuDusProps extends GetDailyListProps {
  type: "WEEK" | "MONTH";
}

export const getPeriodDDuDus = async ({ userId, date, type }: GetPeriodDDuDusProps) => {
  const selectedDate = `&date=${date}`;
  const endpoint = type === "WEEK" ? FEED.WEEKLY_DDUDUS : FEED.MONTHLY_DDUDUS;

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

export const getDDuDuDetail = async ({ id }: FetchUpdateDDuDuProps) => {
  const response = await fetchApi(`${FEED.DDUDU}/${id}`, { method: "GET" }, true);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

interface FetchCreateDDuDuProps {
  requestDDuDu: RequestDDuDu;
}

export const fetchCreateDDuDu = async ({ requestDDuDu }: FetchCreateDDuDuProps) => {
  const response = await fetchApi(
    `${FEED.DDUDU}`,
    {
      method: "POST",
      body: JSON.stringify(requestDDuDu),
    },
    true,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

interface FetchEditDDuDuProps {
  id: number;
  name: string;
}

export const fetchEditDDuDu = async ({ id, name }: FetchEditDDuDuProps) => {
  const response = await fetchApi(
    `${FEED.DDUDU}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({ name }),
    },
    true,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

interface FetchUpdateDDuDuProps {
  id: number;
}

export const fetchDeleteDDuDu = async ({ id }: FetchUpdateDDuDuProps) => {
  const response = await fetchApi(`${FEED.DDUDU}/${id}`, { method: "DELETE" }, true);

  if (response.status === 204) {
    return response.status;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const fetchCompleteToggleDDuDu = async ({ id }: FetchUpdateDDuDuProps) => {
  const response = await fetchApi(`${FEED.DDUDU}/${id}/status`, { method: "PATCH" }, true);

  if (response.status !== 204) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

interface fetchDDuDuDateProps {
  id: number;
  date: string;
}

export const fetchDDuDuChangeDate = async ({ id, date }: fetchDDuDuDateProps) => {
  const changedDate: RequestDDuDuChangeDate = { newDate: date };

  const response = await fetchApi(
    `${FEED.DDUDU}/${id}/date`,
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

export const fetchDDuDuRepeatDate = async ({ id, date }: fetchDDuDuDateProps) => {
  const response = await fetchApi(
    `${FEED.DDUDU}/${id}/repeat`,
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

interface FetchDDuDUChangeTimeProps {
  time: DDuDuTimeType;
  id: number;
}

export const fetchDDuDuChangeTime = async ({ time, id }: FetchDDuDUChangeTimeProps) => {
  const response = await fetchApi(
    `${FEED.DDUDU}/${id}/period`,
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
