import { useEffect, useRef, useState } from "react";

import { socialLogin } from "@/service/auth/auth";
import { useAuthStore } from "@/stores";
import { SocialLoginResponse } from "@/types/response/auth/auth";
import { issueAccessTokenWithCodeWeb, login, setAccessTokenWeb } from "@react-native-kakao/user";

import { UseOauth2LoginParams } from "./use-oauth2-login";

import { createURL } from "expo-linking";

function useOauth2Login({ code }: UseOauth2LoginParams) {
  const socialTokenIssued = useRef(false);
  const redirectUri = createURL("");
  const authenticate = useAuthStore((state) => state.authenticate);
  const [authLoading, setAuthLoading] = useState(!!code);

  useEffect(() => {
    const getKakaoAccessToken = async () => {
      const socialToken = await issueAccessTokenWithCodeWeb({
        code: code!,
        redirectUri: redirectUri,
      });

      if (!socialToken) {
        setAuthLoading(false);
        return;
      }

      setAccessTokenWeb(socialToken.accessToken);

      const { accessToken, refreshToken }: SocialLoginResponse = await socialLogin({
        socialToken: socialToken.accessToken,
        providerType: "KAKAO",
      });

      authenticate(accessToken, refreshToken);
    };

    if (code && !socialTokenIssued.current) {
      setAuthLoading(true);
      getKakaoAccessToken();
    }
  }, [authenticate, code, redirectUri]);

  const handleKakaoLogin = async () => {
    await login({
      web: {
        redirectUri: redirectUri,
        prompt: ["select_account"],
      },
    });
  };

  return {
    authLoading,
    handleKakaoLogin,
  };
}

export default useOauth2Login;
