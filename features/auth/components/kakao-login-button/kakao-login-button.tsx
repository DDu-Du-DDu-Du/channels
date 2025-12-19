import { Pressable, Text, View } from "react-native";

import { KakaoLoginIcon } from "@/icons";

import { LoginButtonProps } from "../login-button/login-button";

function KakaoLoginButton({ label = "카카오 로그인", onPress, size = "medium" }: LoginButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-[12px] bg-[#FEE500]"
    >
      <View
        className={`flex-row items-center justify-center ${
          size === "medium" ? "h-[45px] gap-[8px] w-[368px]" : "h-[90px] gap-[16px] w-[736px]"
        }`}
      >
        <KakaoLoginIcon size={18} />
        <Text className="font-semibold text-[15px] text-[#000000D9]">{label}</Text>
      </View>
    </Pressable>
  );
}

export default KakaoLoginButton;
