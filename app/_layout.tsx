import "../global.css";

import { useEffect } from "react";
import { LocaleConfig } from "react-native-calendars";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { OutsidePressProvider, TanstackProvider } from "../providers";

import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";

const StorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

export const unstable_settings = {
  initialRouteName: StorybookEnabled ? "(storybook)/index" : "(pages)/index",
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

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <TanstackProvider>
      <OutsidePressProvider>
        <BottomSheetModalProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(pages)/index" />
            <Stack.Protected guard={StorybookEnabled}>
              <Stack.Screen name="(storybook)/index" />
            </Stack.Protected>
          </Stack>
        </BottomSheetModalProvider>
      </OutsidePressProvider>
    </TanstackProvider>
  );
}
