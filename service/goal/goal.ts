import { fetchApi } from "@/api";
import { GOAL } from "@/constants/end-points";
import { isGuestSession } from "@/service/guest-storage/guest-session";
import {
  createGuestGoal,
  deleteGuestGoal,
  editGuestGoal,
  getGuestGoalDetail,
  getGuestGoalList,
  terminateGuestGoal,
} from "@/service/guest-storage/guest-storage";
import {
  GoalEditRequestType,
  GoalRequestType,
  GoalTerminateRequestType,
} from "@/types/request/goal/goal";

interface GetGoalListProps {
  userId: number;
}

export const getGoalList = async ({ userId }: GetGoalListProps) => {
  if (isGuestSession()) {
    return getGuestGoalList();
  }

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

interface GoalIdProps {
  goalId: number;
}

interface EditGoalProps extends GoalIdProps {
  requestGoal: GoalEditRequestType;
}

interface TerminateGoalProps extends GoalIdProps {
  requestGoal: GoalTerminateRequestType;
}

const parseErrorMessage = async (response: Response) => {
  let message = `HTTP error! status: ${response.status}`;

  try {
    const errorBody = await response.json();
    if (Array.isArray(errorBody) && errorBody[0]?.message) {
      message = errorBody[0].message;
    } else if (errorBody?.message) {
      message = errorBody.message;
    }
  } catch {
    // noop
  }

  return message;
};

export const createGoal = async ({ requestGoal }: CreateGoalProps) => {
  if (isGuestSession()) {
    return createGuestGoal({ requestGoal });
  }

  const response = await fetchApi(
    `${GOAL.CREATE}`,
    {
      method: "POST",
      body: JSON.stringify(requestGoal),
    },
    true,
  );

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  if (response.status === 204) {
    return response.status;
  }

  return response.json();
};

export const getGoalDetail = async ({ goalId }: GoalIdProps) => {
  if (isGuestSession()) {
    return getGuestGoalDetail({ goalId });
  }

  const response = await fetchApi(
    `${GOAL.DETAIL}/${goalId}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    },
    true,
  );

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return response.json();
};

export const editGoal = async ({ goalId, requestGoal }: EditGoalProps) => {
  if (isGuestSession()) {
    return editGuestGoal({ goalId, requestGoal });
  }

  const response = await fetchApi(
    `${GOAL.EDIT}/${goalId}`,
    {
      method: "PUT",
      body: JSON.stringify(requestGoal),
    },
    true,
  );

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  if (response.status === 204) {
    return response.status;
  }

  return response.json();
};

export const terminateGoal = async ({ goalId, requestGoal }: TerminateGoalProps) => {
  if (isGuestSession()) {
    return terminateGuestGoal({ goalId, requestGoal });
  }

  const response = await fetchApi(
    `${GOAL.TERMINATE}/${goalId}`,
    {
      method: "PATCH",
      body: JSON.stringify(requestGoal),
    },
    true,
  );

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  if (response.status === 204) {
    return response.status;
  }

  return response.json();
};

export const deleteGoal = async ({ goalId }: GoalIdProps) => {
  if (isGuestSession()) {
    return deleteGuestGoal({ goalId });
  }

  const response = await fetchApi(`${GOAL.DELETE}/${goalId}`, { method: "DELETE" }, true);

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  if (response.status === 204) {
    return response.status;
  }

  return response.json();
};
