import React from "react";

import { useSettingsBootstrap, useSettingsSync } from "@/features/settings/hooks";
import { useI18nCalendarBridge } from "@/i18n/i18n-calendar-bridge";
import { useAuthStore, useSettingsStore } from "@/stores";

interface SettingsProviderProps {
  children: React.ReactNode;
}

function SettingsProvider({ children }: SettingsProviderProps) {
  const isMemberSession = useAuthStore((state) => state.sessionType === "member");
  const language = useSettingsStore((state) => state.display.language);

  useSettingsBootstrap({ enabled: isMemberSession });
  useSettingsSync({ enabled: isMemberSession });
  useI18nCalendarBridge(language);

  return <>{children}</>;
}

export default SettingsProvider;
