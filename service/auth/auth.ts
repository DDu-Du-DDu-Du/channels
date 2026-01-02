import { fetchApi } from "@/api";
import AUTH from "@/constants/end-points/auth/auth";
import type { SocialLoginRequest } from "@/types/request/auth/auth";

export async function socialLogin({ socialToken, providerType }: SocialLoginRequest) {
  const response = await fetchApi(`${AUTH.LOGIN}/${providerType}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${socialToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
