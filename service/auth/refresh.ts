import { fetchRefresh } from "@/api";
import { AUTH } from "@/constants/end-points";
import { RefreshTokenRequest } from "@/types/request/auth/auth";

export async function refresh({ refreshToken }: RefreshTokenRequest) {
  const response = await fetchRefresh(AUTH.REFRESH, {
    headers: {
      "X-Refresh-Token": refreshToken,
    },
  });

  if (!response.ok) {
    throw new Error(`Refresh Token failed: ${response.status}`);
  }

  return response.json();
}
