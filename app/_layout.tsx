import "../global.css";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { ToastProvider } from "@/components";
import "@/i18n";
import { OutsidePressProvider, SettingsProvider, TanstackProvider } from "@/providers";
import AuthProvider from "@/providers/auth-provider/auth-provider";
import { useAuthStore, useSettingsStore } from "@/stores";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { initializeKakaoSDK } from "@react-native-kakao/core";

import { useFonts } from "expo-font";
import { SplashScreen, Stack, usePathname } from "expo-router";

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";
const loginDisabled = process.env.EXPO_PUBLIC_LOGIN_DISABLED === "true";

export const unstable_settings = {
  initialRouteName: storybookEnabled ? "storybook/index" : "index",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const [loaded, error] = useFonts({
    "SpoqaHanSansNeo-Bold": require("@/assets/fonts/SpoqaHanSans/SpoqaHanSansNeo-Bold.otf"),
    "SpoqaHanSansNeo-SemiBold": require("@/assets/fonts/SpoqaHanSans/SpoqaHanSansNeo-Medium.otf"),
    "SpoqaHanSansNeo-Medium": require("@/assets/fonts/SpoqaHanSans/SpoqaHanSansNeo-Regular.otf"),
    "SpoqaHanSansNeo-Regular": require("@/assets/fonts/SpoqaHanSans/SpoqaHanSansNeo-Light.otf"),
    "SpoqaHanSansNeo-Thin": require("@/assets/fonts/SpoqaHanSans/SpoqaHanSansNeo-Thin.otf"),
  });
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const sessionType = useAuthStore((state) => state.sessionType);
  const isDarkMode = useSettingsStore((state) => state.display.isDarkMode);

  useEffect(() => {
    initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_NATIVE_KEY ?? "", {
      web: {
        javascriptKey: process.env.EXPO_PUBLIC_KAKAO_JS_KEY ?? "",
        restApiKey: process.env.EXPO_PUBLIC_KAKAO_REST_KEY ?? "",
      },
    }).catch((err) => console.error("Kakao initialization failed:", err));

    useAuthStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.title = t("app.name");
  }, [i18n.language, pathname, t]);

  if (!hasHydrated || (!loaded && !error)) {
    return null;
  }

  const rootClassName = isDarkMode ? "dark flex-1" : "flex-1";

  return (
    <View className={rootClassName}>
      <TanstackProvider>
        <ToastProvider>
          <AuthProvider>
            <SettingsProvider>
              <OutsidePressProvider>
                <BottomSheetModalProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Protected guard={storybookEnabled}>
                      <Stack.Screen name="storybook/index" />
                    </Stack.Protected>
                    <Stack.Protected guard={!isLoggedIn || sessionType === "guest"}>
                      <Stack.Screen name="index" />
                    </Stack.Protected>
                    <Stack.Protected guard={isLoggedIn || loginDisabled}>
                      <Stack.Screen name="(tabs)" />
                    </Stack.Protected>
                  </Stack>
                </BottomSheetModalProvider>
              </OutsidePressProvider>
            </SettingsProvider>
          </AuthProvider>
        </ToastProvider>
      </TanstackProvider>
    </View>
  );
}
