import React, { useEffect } from "react";

import { useMe } from "@/features/user";
import { useAuthStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const login = useAuthStore((state) => state.login);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { isSuccess, isError } = useMe({});
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      login();
    }
  }, [isSuccess, login]);

  useEffect(() => {
    if (isError) {
      clearSession();
      queryClient.clear();
    }
  }, [clearSession, isError, queryClient]);

  return <>{children}</>;
}

export default AuthProvider;
