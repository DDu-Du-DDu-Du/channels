import { View } from "react-native";

import { Button } from "@/components";
import { LoginButton, LoginTitle, useOauth2Login } from "@/features/auth";
import { useAuthStore } from "@/stores";

export function Auth() {
  const { handleKakaoLogin } = useOauth2Login({});
  const handleGuestLogin = useAuthStore((state) => state.handleGuestLogin);

  return (
    <View className="flex-1 item-center justify-center w-4/5 mx-auto max-w-[537px] gap-20">
      <LoginTitle />
      <View className="w-full gap-[1.2rem]">
        <LoginButton
          provider="kakao"
          onPress={handleKakaoLogin}
          label="카카오로 계속하기"
          fit={true}
        />
        <Button
          label="게스트 로그인"
          onPress={handleGuestLogin}
          bodyClassName="bg-role-surface-canvas dark:bg-role-dark-surface-canvas border border-role-border-subtle dark:border-role-dark-border-subtle"
          labelClassName="text-role-text-primary dark:text-role-dark-text-primary"
        />
      </View>
    </View>
  );
}

export default Auth;
