import { View } from "react-native";

import { LoginButton } from "@/features/auth";
import { SocialLoginButtonProps } from "@/features/auth/components/login-button/login-button";

function LoginButtonView(props: SocialLoginButtonProps) {
  return (
    <View className="w-2/5 mx-auto flex-1 items-center justify-center p-4">
      <LoginButton {...props} />
    </View>
  );
}

export default LoginButtonView;
