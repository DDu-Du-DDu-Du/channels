import { useCallback, useEffect, useState } from "react";

import { AUTH_STORAGE_KEYS } from "@/constants/auth/auth";
import { socialLogin } from "@/service/auth/auth";
import { getMe } from "@/service/user/user";
import type { SocialLoginResponse } from "@/types/auth/auth";
import { MeResponse } from "@/types/response/user/me";
import { SessionStorage } from "@/utils/storage";
import { login } from "@react-native-kakao/user";

export interface UseAuthParam {
  isRoot?: boolean;
}

function useAuth({ isRoot = true }: UseAuthParam) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);

  const validateAuth = useCallback(async () => {
    const userLoaded = await SessionStorage.getItem(AUTH_STORAGE_KEYS.USER_ID);

    if (userLoaded) {
      setIsLoggedIn(true);
      setAuthLoaded(true);

      return;
    }

    const accessToken = await SessionStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);

    if (!accessToken) {
      setAuthLoaded(true);

      return;
    }

    const me: MeResponse = await getMe({ accessToken });

    if (!me) {
      setAuthLoaded(true);

      return;
    }

    await SessionStorage.setItem(AUTH_STORAGE_KEYS.USER_ID, me.id);

    setIsLoggedIn(true);
    setAuthLoaded(true);
  }, []);

  useEffect(() => {
    if (!isRoot) {
      return;
    }

    validateAuth();
  }, [isRoot, validateAuth]);

  const handleKakaoLogin = useCallback(async () => {
    const kakaoResult = await login();
    // TODO: pod install로 나중에 확인해야함
    const socialToken = kakaoResult?.accessToken;

    if (!socialToken) {
      throw new Error("Kakao login did not return an access token");
    }

    const response: SocialLoginResponse = await socialLogin({
      socialToken,
      providerType: "KAKAO",
    });

    await SessionStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    await SessionStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);

    const me: MeResponse = await getMe({ accessToken: response.accessToken });

    await SessionStorage.setItem(AUTH_STORAGE_KEYS.USER_ID, me.id);
    setIsLoggedIn(true);
    setAuthLoaded(true);
  }, []);

  return {
    isLoggedIn,
    authLoaded,
    handleKakaoLogin,
  };
}

export default useAuth;
