import React, { useEffect } from "react";
import { Platform } from "react-native";

import { useMe } from "@/features/user";
import { registerDeviceToken } from "@/service/device-token/device-token";
import { getTokenAsync } from "@/service/push/get-token/get-token";
import { useAuthStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const login = useAuthStore((state) => state.login);
  const clearSession = useAuthStore((state) => state.clearSession);
  const hasRegisteredDeviceToken = useAuthStore((state) => state.hasRegisteredDeviceToken);
  const markDeviceTokenRegistered = useAuthStore((state) => state.markDeviceTokenRegistered);
  const resetDeviceTokenRegistration = useAuthStore((state) => state.resetDeviceTokenRegistration);
  const { isSuccess, isError } = useMe({});
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      login();

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
    }
  }, [hasRegisteredDeviceToken, isSuccess, login, markDeviceTokenRegistered]);

  useEffect(() => {
    if (isError) {
      resetDeviceTokenRegistration();
      clearSession();
      queryClient.clear();
    }
  }, [clearSession, isError, queryClient, resetDeviceTokenRegistration]);

  return <>{children}</>;
}

export default AuthProvider;
