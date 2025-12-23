import { View } from "react-native";

import { LoginButton, LoginTitle, useAuth } from "@/features/auth";

export function Auth() {
  const { handleKakaoLogin } = useAuth({ isRoot: false });

  return (
    <View className="flex-1 item-center justify-center w-4/5 mx-auto max-w-[537px] gap-20">
      <LoginTitle />
      <LoginButton
        provider="kakao"
        onPress={handleKakaoLogin}
        label="카카오로 계속하기"
        fit={true}
      />
    </View>
  );
}

export default Auth;
