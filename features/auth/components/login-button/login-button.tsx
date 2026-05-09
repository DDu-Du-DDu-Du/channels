import { useTranslation } from "react-i18next";

import KakaoLoginButton from "../kakao-login-button/kakao-login-button";

type LoginButtonSize = "medium" | "large";
type LoginButtonProvider = "kakao" | "naver" | "google";

export interface LoginButtonProps {
  label?: string;
  onPress?: () => void;
  size?: LoginButtonSize;
  fit: boolean;
}

export interface SocialLoginButtonProps extends LoginButtonProps {
  provider?: LoginButtonProvider;
}

function LoginButton({
  provider = "kakao",
  label,
  onPress,
  size = "medium",
  fit = false,
}: SocialLoginButtonProps) {
  const { t } = useTranslation();

  if (provider === "kakao") {
    return (
      <KakaoLoginButton
        label={label ?? t("auth.kakaoLogin")}
        onPress={onPress}
        size={size}
        fit={fit}
      />
    );
  }

  return null;
}

export default LoginButton;
