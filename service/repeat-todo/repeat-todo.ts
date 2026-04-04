import { fetchApi } from "@/api";
import { REPEAT_TODO } from "@/constants/end-points";
import { isGuestSession } from "@/service/guest-storage/guest-session";
import {
  createGuestRepeatTodo,
  deleteGuestRepeatTodo,
  editGuestRepeatTodo,
} from "@/service/guest-storage/guest-storage";
import type {
  RepeatTodoCreateRequestType,
  RepeatTodoRequestType,
} from "@/types/request/repeat-todo/repeat-todo";

interface CreateRepeatTodoProps {
  requestRepeatTodo: RepeatTodoCreateRequestType;
}

interface EditRepeatTodoProps {
  repeatTodoId: number;
  requestRepeatTodo: RepeatTodoRequestType;
}

interface DeleteRepeatTodoProps {
  repeatTodoId: number;
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

export const createRepeatTodo = async ({ requestRepeatTodo }: CreateRepeatTodoProps) => {
  if (isGuestSession()) {
    return createGuestRepeatTodo({ requestRepeatTodo });
  }

  const response = await fetchApi(
    `${REPEAT_TODO.CREATE}`,
    {
      method: "POST",
      body: JSON.stringify(requestRepeatTodo),
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

export const editRepeatTodo = async ({ repeatTodoId, requestRepeatTodo }: EditRepeatTodoProps) => {
  if (isGuestSession()) {
    return editGuestRepeatTodo({ repeatTodoId, requestRepeatTodo });
  }

  const response = await fetchApi(
    `${REPEAT_TODO.EDIT}/${repeatTodoId}`,
    {
      method: "PUT",
      body: JSON.stringify(requestRepeatTodo),
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

export const deleteRepeatTodo = async ({ repeatTodoId }: DeleteRepeatTodoProps) => {
  if (isGuestSession()) {
    return deleteGuestRepeatTodo({ repeatTodoId });
  }

  const response = await fetchApi(
    `${REPEAT_TODO.DELETE}/${repeatTodoId}`,
    { method: "DELETE" },
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
