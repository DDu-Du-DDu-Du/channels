import React from "react";

import { useSettingsBootstrap, useSettingsSync } from "@/features/settings/hooks";
import { useAuthStore } from "@/stores";

interface SettingsProviderProps {
  children: React.ReactNode;
}

function SettingsProvider({ children }: SettingsProviderProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useSettingsBootstrap({ enabled: isLoggedIn });
  useSettingsSync({ enabled: isLoggedIn });

  return <>{children}</>;
}

export default SettingsProvider;
