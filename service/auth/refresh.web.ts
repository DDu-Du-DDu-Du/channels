import { fetchRefresh } from "@/api";
import { AUTH } from "@/constants/end-points";
import { RefreshTokenRequest } from "@/types/request/auth/auth";

export async function refresh({ refreshToken }: RefreshTokenRequest) {
  const response = await fetchRefresh(AUTH.REFRESH, {
    // TODO: 서버 refresh 로직 변경 후 헤더 제거
    headers: {
      "X-Refresh-Token": refreshToken,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Refresh Token failed: ${response.status}`);
  }

  return response.json();
}
