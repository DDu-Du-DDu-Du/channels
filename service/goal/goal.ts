import { fetchApi } from "@/api";
import { GOAL } from "@/constants/end-points";
import { GoalRequestType } from "@/types/request/goal/goal";

interface GetGoalListProps {
  userId: number;
}

export const getGoalList = async ({ userId }: GetGoalListProps) => {
  const response = await fetchApi(
    `${GOAL.LIST}?userId=${userId}`,
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

interface CreateGoalProps {
  requestGoal: GoalRequestType;
}

export const createGoal = async ({ requestGoal }: CreateGoalProps) => {
  const response = await fetchApi(
    `${GOAL.CREATE}`,
    {
      method: "POST",
      body: JSON.stringify(requestGoal),
    },
    true,
  );

  if (!response.ok) {
    let message = `HTTP error! status: ${response.status}`;

    try {
      const errorBody = await response.json();
      message = errorBody[0].message ?? message;
    } catch {
      // noop
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return response.status;
  }

  return response.json();
};
