import { View } from "react-native";

import { SpoqaText } from "@/components";

function AuthLoading() {
  return (
    <View className="flex-1 justify-center items-center">
      <SpoqaText
        weight="bold"
        className="text-size17"
      >
        사용자 인증 중..
      </SpoqaText>
    </View>
  );
}

export default AuthLoading;
