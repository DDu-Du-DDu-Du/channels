import { useOauth2Login } from "@/features/auth";

import { Stack, useGlobalSearchParams } from "expo-router";

function AuthLayout() {
  const { code } = useGlobalSearchParams<{ code?: string }>();
  const { authLoading } = useOauth2Login({ code });

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={authLoading}>
        <Stack.Screen name="loading" />
      </Stack.Protected>
      <Stack.Protected guard={!authLoading}>
        <Stack.Screen name="index" />
      </Stack.Protected>
    </Stack>
  );
}

export default AuthLayout;
