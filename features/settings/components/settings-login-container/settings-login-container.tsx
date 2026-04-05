import { View } from "react-native";

import { LoginButton, useOauth2Login } from "@/features/auth";

interface SettingsLoginProvider {
  key: string;
  label: string;
  provider: "kakao";
}

const LOGIN_PROVIDERS: SettingsLoginProvider[] = [
  {
    key: "kakao",
    label: "카카오 로그인",
    provider: "kakao",
  },
];

function SettingsLoginContainer() {
  const { handleKakaoLogin } = useOauth2Login({});

  return (
    <View className="border-b border-role-border-subtle py-[0.8rem] dark:border-role-dark-border-subtle">
      <View className="w-full">
        {LOGIN_PROVIDERS.map((provider) => (
          <LoginButton
            key={provider.key}
            provider={provider.provider}
            label={provider.label}
            onPress={handleKakaoLogin}
            fit={true}
          />
        ))}
      </View>
    </View>
  );
}

export default SettingsLoginContainer;
