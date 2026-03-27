import { fetchRefresh } from "@/api";
import { AUTH } from "@/constants/end-points";
import { RefreshTokenRequest } from "@/types/request/auth/auth";

export async function refresh({ refreshToken }: RefreshTokenRequest) {
  const response = await fetchRefresh(AUTH.REFRESH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`Refresh Token failed: ${response.status}`);
  }

  return response.json();
}
