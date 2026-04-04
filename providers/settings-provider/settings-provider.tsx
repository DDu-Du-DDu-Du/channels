import React from "react";

import { useSettingsBootstrap, useSettingsSync } from "@/features/settings/hooks";
import { useAuthStore } from "@/stores";

interface SettingsProviderProps {
  children: React.ReactNode;
}

function SettingsProvider({ children }: SettingsProviderProps) {
  const isMemberSession = useAuthStore((state) => state.sessionType === "member");

  useSettingsBootstrap({ enabled: isMemberSession });
  useSettingsSync({ enabled: isMemberSession });

  return <>{children}</>;
}

export default SettingsProvider;
