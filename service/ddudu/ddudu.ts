import { fetchApi } from "@/api";
import { DDUDU } from "@/constants/end-points";
import type { DDuDuSearchResponseType } from "@/types/response/ddudu/ddudu";

interface GetDDuDuSearchProps {
  query: string;
  size?: number;
  cursor?: string | null;
}

export const getDDuDuSearch = async ({
  query,
  size = 20,
  cursor = null,
}: GetDDuDuSearchProps): Promise<DDuDuSearchResponseType> => {
  const queryParams = [`query=${encodeURIComponent(query)}`, `size=${size}`];

  if (cursor) {
    queryParams.push(`cursor=${encodeURIComponent(cursor)}`);
  }

  const response = await fetchApi(
    `${DDUDU.SEARCH}?${queryParams.join("&")}`,
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
