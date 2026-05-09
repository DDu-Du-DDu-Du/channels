import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Button, SpoqaText } from "@/components";
import { LoginButton, LoginTitle, useOauth2Login } from "@/features/auth";
import { useMenuActivationTabRouting } from "@/hooks";
import { useAuthStore } from "@/stores";

import { Redirect, useGlobalSearchParams } from "expo-router";

function Index() {
  const { t } = useTranslation();
  const { code: rawCode } = useGlobalSearchParams<{ code?: string | string[] }>();
  const sessionType = useAuthStore((state) => state.sessionType);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const handleGuestLogin = useAuthStore((state) => state.handleGuestLogin);
  const { firstActiveHref } = useMenuActivationTabRouting();

  const code =
    typeof rawCode === "string"
      ? rawCode
      : Array.isArray(rawCode) && typeof rawCode[0] === "string"
        ? rawCode[0]
        : undefined;
  const hasCode = Boolean(code && code.length > 0);
  const { authLoading, handleKakaoLogin } = useOauth2Login({ code });

  if (sessionType === "guest" && !hasCode) {
    return <Redirect href={firstActiveHref} />;
  }

  if (isLoggedIn && sessionType === "member") {
    return <Redirect href={firstActiveHref} />;
  }

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <SpoqaText
          weight="bold"
          className="text-size17"
        >
          {t("app.authenticating")}
        </SpoqaText>
      </View>
    );
  }

  return (
    <View className="flex-1 item-center mx-auto w-4/5 max-w-[537px] justify-center gap-20">
      <LoginTitle />
      <View className="w-full gap-[1.2rem]">
        <LoginButton
          provider="kakao"
          onPress={handleKakaoLogin}
          label={t("auth.continueWithKakao")}
          fit={true}
        />
        <Button
          label={t("auth.guestLogin")}
          onPress={handleGuestLogin}
          bodyClassName="border border-role-border-subtle bg-role-surface-canvas dark:border-role-dark-border-subtle dark:bg-role-dark-surface-canvas"
          labelClassName="text-role-text-primary dark:text-role-dark-text-primary"
        />
      </View>
    </View>
  );
}

export default Index;
