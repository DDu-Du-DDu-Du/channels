import KakaoLoginButton from "../kakao-login-button/kakao-login-button";

type LoginButtonSize = "medium" | "large";
type LoginButtonProvider = "kakao" | "naver" | "google";

export interface LoginButtonProps {
  label?: string;
  onPress?: () => void;
  size?: LoginButtonSize;
}

export interface SocialLoginButtonProps extends LoginButtonProps {
  provider?: LoginButtonProvider;
}

function LoginButton({
  provider = "kakao",
  label,
  onPress,
  size = "medium",
}: SocialLoginButtonProps) {
  if (provider === "kakao") {
    return (
      <KakaoLoginButton
        label={label ?? "카카오 로그인"}
        onPress={onPress}
        size={size}
      />
    );
  }

  return null;
}

export default LoginButton;
