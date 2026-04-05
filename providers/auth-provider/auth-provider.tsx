import React, { useEffect } from "react";
import { Platform } from "react-native";

import { NOTIFICATION_KEY } from "@/constants/query-key/query-key";
import { useMe } from "@/features/user";
import { registerDeviceToken } from "@/service/device-token/device-token";
import { getNotificationInboxStatus } from "@/service/notification/notification";
import { getTokenAsync } from "@/service/push/get-token/get-token";
import { useAuthStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const login = useAuthStore((state) => state.login);
  const clearSession = useAuthStore((state) => state.clearSession);
  const hasTokens = useAuthStore((state) => Boolean(state.accessToken && state.refreshToken));
  const hasRegisteredDeviceToken = useAuthStore((state) => state.hasRegisteredDeviceToken);
  const markDeviceTokenRegistered = useAuthStore((state) => state.markDeviceTokenRegistered);
  const resetDeviceTokenRegistration = useAuthStore((state) => state.resetDeviceTokenRegistration);
  const { isSuccess, isError } = useMe({});
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hasTokens || !isSuccess) {
      return;
    }

    login();
    void queryClient.prefetchQuery({
      queryKey: [NOTIFICATION_KEY.INBOX_STATUS],
      queryFn: getNotificationInboxStatus,
    });

    // TODO: native getTokenAsync 구현 완료 후 플랫폼 분기 제거하고 공통 경로로 전환
    if (Platform.OS !== "web" || hasRegisteredDeviceToken) {
      return;
    }

    const handleRegisterWebDeviceToken = async () => {
      const token = await getTokenAsync();

      if (!token) {
        return;
      }

      await registerDeviceToken({
        channel: "WEB",
        token,
      });

      markDeviceTokenRegistered();
    };

    handleRegisterWebDeviceToken().catch((error) => {
      console.error("[push] failed to register device token:", error);
    });
  }, [
    hasRegisteredDeviceToken,
    hasTokens,
    isSuccess,
    login,
    markDeviceTokenRegistered,
    queryClient,
  ]);

  useEffect(() => {
    if (!hasTokens || !isError) {
      return;
    }

    resetDeviceTokenRegistration();
    clearSession();
    queryClient.clear();
  }, [clearSession, hasTokens, isError, queryClient, resetDeviceTokenRegistration]);

  return <>{children}</>;
}

export default AuthProvider;
