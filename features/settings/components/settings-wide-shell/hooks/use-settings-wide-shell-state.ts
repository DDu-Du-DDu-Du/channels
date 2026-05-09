import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/components/toast/hooks";
import { handleIsDesignTokenLabEnabled } from "@/constants";
import { useToggle } from "@/hooks";
import { logout } from "@/service/auth/auth";
import { clearGuestLocalData } from "@/service/guest-storage/guest-storage";
import { useAuthStore } from "@/stores";
import useSettingsStore from "@/stores/use-settings-store/use-settings-store";
import { useQueryClient } from "@tanstack/react-query";

import Constants from "expo-constants";
import { Href, useRouter } from "expo-router";

export const SETTINGS_WIDE_BREAKPOINT = 768;

export type SettingsWideSection =
  | "display"
  | "menu-activation"
  | "app-connection"
  | "design-system"
  | "bug-report"
  | "announcement";

export const SETTINGS_WIDE_DEFAULT_SECTION: SettingsWideSection = "display";

export const handleIsSettingsWideLayout = (width: number) => width > SETTINGS_WIDE_BREAKPOINT;

interface UseSettingsWideShellStateParams {
  initialSection?: SettingsWideSection;
}

function useSettingsWideShellState({
  initialSection = SETTINGS_WIDE_DEFAULT_SECTION,
}: UseSettingsWideShellStateParams) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { createToast } = useToast();
  const isDesignTokenLabEnabled = handleIsDesignTokenLabEnabled();
  const [selectedSection, setSelectedSection] = useState<SettingsWideSection>(initialSection);
  const sessionType = useAuthStore((state) => state.sessionType);
  const clearSession = useAuthStore((state) => state.clearSession);
  const handleResetSettings = useSettingsStore((state) => state.handleResetSettings);
  const {
    isToggle: isLogoutConfirmOpen,
    handleToggleOn: handleOpenLogoutConfirm,
    handleToggleOff: handleCloseLogoutConfirm,
  } = useToggle();
  const appVersion = Constants.expoConfig?.version ?? "-";

  useEffect(() => {
    setSelectedSection(initialSection);
  }, [initialSection]);

  useEffect(() => {
    if (isDesignTokenLabEnabled || selectedSection !== "design-system") {
      return;
    }

    setSelectedSection(SETTINGS_WIDE_DEFAULT_SECTION);
  }, [isDesignTokenLabEnabled, selectedSection]);

  const handleSelectSection = (section: SettingsWideSection) => {
    if (section === "design-system" && !isDesignTokenLabEnabled) {
      return;
    }

    if (section === "design-system") {
      router.push("/settings/design-system" as Href);
      return;
    }

    setSelectedSection(section);
  };

  const handlePressLogout = () => {
    handleOpenLogoutConfirm();
  };

  const handleLogoutConfirmResult = async (isComplete: boolean) => {
    if (!isComplete) {
      return;
    }

    if (sessionType === "member") {
      try {
        await logout();
      } catch {
        // Ignore logout API failure and continue local sign-out.
      }
    } else if (sessionType === "guest") {
      await clearGuestLocalData();
    }

    clearSession();
    handleResetSettings();
    queryClient.clear();
    router.replace("/" as Href);
  };

  const handleValidationError = () => {
    createToast(t("settings.minimumMenuWarning"), { type: "warning" });
  };

  return {
    appVersion,
    isDesignTokenLabEnabled,
    isLogoutConfirmOpen,
    selectedSection,
    sessionType,
    handleCloseLogoutConfirm,
    handleLogoutConfirmResult,
    handlePressLogout,
    handleSelectSection,
    handleValidationError,
  };
}

export default useSettingsWideShellState;
