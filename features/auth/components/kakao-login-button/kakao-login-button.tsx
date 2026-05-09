import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { KakaoLoginIcon } from "@/icons";

import { LoginButtonProps } from "../login-button/login-button";

function KakaoLoginButton({ label, onPress, size = "medium", fit }: LoginButtonProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-[12px] bg-[#FEE500] ${fit ? "w-full" : size === "medium" ? "w-[368px]" : "w-[736px]"}`}
    >
      <View
        className={`flex-row items-center justify-center ${
          size === "medium" ? "h-[45px] gap-[8px]" : "h-[90px] gap-[16px]"
        }`}
      >
        <KakaoLoginIcon size={18} />
        <Text
          className={`font-semibold text-[#000000D9] ${size === "medium" ? "text-[15px]" : "text-[30px]"}`}
        >
          {label ?? t("auth.kakaoLogin")}
        </Text>
      </View>
    </Pressable>
  );
}

export default KakaoLoginButton;
