import "../global.css";

import { useEffect } from "react";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { OutsidePressProvider, TanstackProvider } from "../providers";

import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";

const StorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

export const unstable_settings = {
  initialRouteName: StorybookEnabled ? "(storybook)/index" : "(pages)/index",
};

SplashScreen.preventAutoHideAsync();

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
