import { refresh } from "@/service/auth/refresh";
import { useAuthStore } from "@/stores";

let refreshPromise: Promise<void> | null = null;

export async function waitForRefresh() {
  console.log("current refresh promise working:", refreshPromise);

  if (refreshPromise) {
    return refreshPromise;
  }

  console.log("refreshing..");

  const clearSession = useAuthStore.getState().clearSession;

  const currentRefreshToken = useAuthStore.getState().refreshToken;

  if (!currentRefreshToken) {
    clearSession();

    throw new Error("There is no refresh token.");
  }

  refreshPromise = (async () => {
    try {
      const { accessToken, refreshToken } = await refresh({ refreshToken: currentRefreshToken });

      useAuthStore.getState().authenticate(accessToken, refreshToken);

      return;
    } catch (error) {
      clearSession();

      console.log("refreshing error:", error);

      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
