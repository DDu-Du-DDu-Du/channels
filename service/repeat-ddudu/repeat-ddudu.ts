import { fetchApi } from "@/api";
import { REPEAT_DDUDU } from "@/constants/end-points";
import type {
  RepeatDduduCreateRequestType,
  RepeatDduduRequestType,
} from "@/types/request/repeat-ddudu/repeat-ddudu";

interface CreateRepeatDduduProps {
  requestRepeatDdudu: RepeatDduduCreateRequestType;
}

interface EditRepeatDduduProps {
  repeatDduduId: number;
  requestRepeatDdudu: RepeatDduduRequestType;
}

interface DeleteRepeatDduduProps {
  repeatDduduId: number;
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

export const createRepeatDdudu = async ({ requestRepeatDdudu }: CreateRepeatDduduProps) => {
  const response = await fetchApi(
    `${REPEAT_DDUDU.CREATE}`,
    {
      method: "POST",
      body: JSON.stringify(requestRepeatDdudu),
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

export const editRepeatDdudu = async ({
  repeatDduduId,
  requestRepeatDdudu,
}: EditRepeatDduduProps) => {
  const response = await fetchApi(
    `${REPEAT_DDUDU.EDIT}/${repeatDduduId}`,
    {
      method: "PUT",
      body: JSON.stringify(requestRepeatDdudu),
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

export const deleteRepeatDdudu = async ({ repeatDduduId }: DeleteRepeatDduduProps) => {
  const response = await fetchApi(
    `${REPEAT_DDUDU.DELETE}/${repeatDduduId}`,
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
