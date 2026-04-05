import { useOauth2Login } from "@/features/auth";
import { useAuthStore } from "@/stores";

import { Redirect, Stack, useGlobalSearchParams } from "expo-router";

function AuthLayout() {
  const { code } = useGlobalSearchParams<{ code?: string }>();
  const sessionType = useAuthStore((state) => state.sessionType);
  const { authLoading } = useOauth2Login({ code });

  const hasCode =
    (typeof code === "string" && code.length > 0) ||
    (Array.isArray(code) && typeof code[0] === "string" && code[0].length > 0);

  if (sessionType === "guest" && !hasCode) {
    return <Redirect href="/" />;
  }

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
