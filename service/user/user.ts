import { fetchApi } from "@/api";
import { USER } from "@/constants/end-points";

interface GetMeParams {
  accessToken: string;
}

export async function getMe({ accessToken }: GetMeParams) {
  const response = await fetchApi(
    USER.ME,
    {
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
}
