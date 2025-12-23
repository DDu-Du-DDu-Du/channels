import { useCallback, useEffect, useState } from "react";

import { AUTH_STORAGE_KEYS } from "@/constants/auth/auth";
import { socialLogin } from "@/service/auth/auth";
import { getMe } from "@/service/user/user";
import { SocialLoginResponse } from "@/types/auth/auth";
import { MeResponse } from "@/types/response/user/me";
import { SessionStorage } from "@/utils/storage";
import { issueAccessTokenWithCodeWeb, login, setAccessTokenWeb } from "@react-native-kakao/user";

import { UseAuthParam } from "./use-auth";

import { createURL } from "expo-linking";
import { router, useGlobalSearchParams } from "expo-router";

function useAuth({ isRoot = true }: UseAuthParam) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const { code } = useGlobalSearchParams<{ code?: string }>();
  const [socialTokenIssued, setSocialTokenIssued] = useState(false);
  const redirectUri = createURL("");

  const validateAuth = useCallback(async () => {
    console.log("validate auth called");
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

  const getKakaoAccessToken = useCallback(async () => {
    const socialToken = await issueAccessTokenWithCodeWeb({
      code: code!,
      redirectUri: redirectUri,
    });

    setAccessTokenWeb(socialToken.accessToken);

    const { accessToken, refreshToken }: SocialLoginResponse = await socialLogin({
      socialToken: socialToken.accessToken,
      providerType: "KAKAO",
    });

    await SessionStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await SessionStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    setSocialTokenIssued(true);
    router.replace("/");
  }, [code, redirectUri]);

  useEffect(() => {
    if (!isRoot) {
      return;
    }

    if (code && !socialTokenIssued) {
      getKakaoAccessToken();
    }

    if (!code && !socialTokenIssued) {
      validateAuth();
    }
  }, [code, socialTokenIssued, getKakaoAccessToken, isRoot, validateAuth]);

  const handleKakaoLogin = useCallback(async () => {
    login({
      web: {
        redirectUri: redirectUri,
        prompt: ["select_account"],
      },
    });
  }, [redirectUri]);

  return {
    isLoggedIn,
    authLoaded,
    handleKakaoLogin,
  };
}

export default useAuth;
