import { handleIsDesignTokenLabEnabled } from "@/constants";

import { Stack } from "expo-router";

function SettingsLayout() {
  const isDesignTokenLabEnabled = handleIsDesignTokenLabEnabled();

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="display" />
      <Stack.Screen name="menu-activation" />
      <Stack.Screen name="app-connection" />
      <Stack.Protected guard={isDesignTokenLabEnabled}>
        <Stack.Screen name="design-system" />
      </Stack.Protected>
    </Stack>
  );
}

export default SettingsLayout;
