import "../global.css";

import { useEffect } from "react";
import { LocaleConfig } from "react-native-calendars";

import { ToastProvider } from "@/components";
import AuthProvider from "@/providers/auth-provider/auth-provider";
import { useAuthStore } from "@/stores";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { initializeKakaoSDK } from "@react-native-kakao/core";

import { OutsidePressProvider, TanstackProvider } from "../providers";

import Constants from "expo-constants";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";
const loginDisabled = process.env.EXPO_PUBLIC_LOGIN_DISABLED === "true";

export const unstable_settings = {
  initialRouteName: storybookEnabled ? "(storybook)/index" : "(tabs)",
};

SplashScreen.preventAutoHideAsync();

LocaleConfig.locales.ko = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "ko";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "SpoqaHanSansNeo-Bold": require("@/assets/fonts/SpoqaHanSans/SpoqaHanSansNeo-Bold.otf"),
    "SpoqaHanSansNeo-SemiBold": require("@/assets/fonts/SpoqaHanSans/SpoqaHanSansNeo-Medium.otf"),
    "SpoqaHanSansNeo-Medium": require("@/assets/fonts/SpoqaHanSans/SpoqaHanSansNeo-Regular.otf"),
    "SpoqaHanSansNeo-Regular": require("@/assets/fonts/SpoqaHanSans/SpoqaHanSansNeo-Light.otf"),
    "SpoqaHanSansNeo-Thin": require("@/assets/fonts/SpoqaHanSans/SpoqaHanSansNeo-Thin.otf"),
  });
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    initializeKakaoSDK(Constants.expoConfig?.extra?.env.kakaoNativeKey, {
      web: {
        javascriptKey: Constants.expoConfig?.extra?.env.kakaoJSKey,
        restApiKey: Constants.expoConfig?.extra?.env.kakaoRestKey,
      },
    }).catch((err) => console.error("Kakao initialization failed:", err));

    useAuthStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!hasHydrated || (!loaded && !error)) {
    return null;
  }

  return (
    <TanstackProvider>
      <ToastProvider>
        <AuthProvider>
          <OutsidePressProvider>
            <BottomSheetModalProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Protected guard={storybookEnabled}>
                  <Stack.Screen name="(storybook)/index" />
                </Stack.Protected>
                <Stack.Protected guard={!isLoggedIn}>
                  <Stack.Screen name="auth" />
                </Stack.Protected>
                <Stack.Protected guard={isLoggedIn || loginDisabled}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="ddudu" />
                  <Stack.Screen name="goal/index" />
                  <Stack.Screen name="goal/create" />
                  <Stack.Screen name="goal/editor" />
                </Stack.Protected>
              </Stack>
            </BottomSheetModalProvider>
          </OutsidePressProvider>
        </AuthProvider>
      </ToastProvider>
    </TanstackProvider>
  );
}
