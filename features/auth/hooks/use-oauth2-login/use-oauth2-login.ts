import { useState } from "react";

import { socialLogin } from "@/service/auth/auth";
import { useAuthStore } from "@/stores";
import { SocialLoginResponse } from "@/types/response/auth/auth";
import { login } from "@react-native-kakao/user";

export interface UseOauth2LoginParams {
  code?: string;
}

function useOauth2Login({ code }: UseOauth2LoginParams) {
  const authenticate = useAuthStore((state) => state.authenticate);
  const [authLoading, setAuthLoading] = useState(false);

  const handleKakaoLogin = async () => {
    setAuthLoading(true);

    const kakaoResult = await login();
    // Todo: pod install로 나중에 확인해야함
    const socialToken = kakaoResult?.accessToken;

    if (!socialToken) {
      setAuthLoading(false);

      return;
    }

    const { accessToken, refreshToken }: SocialLoginResponse = await socialLogin({
      socialToken,
      providerType: "KAKAO",
    });

    authenticate(accessToken, refreshToken);
  };

  return {
    authLoading,
    handleKakaoLogin,
  };
}

export default useOauth2Login;
