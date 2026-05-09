import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { ConfirmModal } from "@/components";
import { handleIsDesignTokenLabEnabled } from "@/constants";
import { useToggle } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { logout } from "@/service/auth/auth";
import { clearGuestLocalData } from "@/service/guest-storage/guest-storage";
import { useAuthStore } from "@/stores";
import useSettingsStore from "@/stores/use-settings-store/use-settings-store";
import { useQueryClient } from "@tanstack/react-query";

import { BugReportSheet, BugReportSheetHandle } from "../bug-report-sheet";
import { SettingsLoginContainer } from "../settings-login-container";
import { SettingsRow } from "../settings-row";

import Constants from "expo-constants";
import { Href, useRouter } from "expo-router";

function SettingsScreen() {
  const { t } = useTranslation();
  const isDesignTokenLabEnabled = handleIsDesignTokenLabEnabled();
  const router = useRouter();
  const queryClient = useQueryClient();
  const dangerTextColor = useThemeColorToken("role.status.error");
  const bugReportSheetRef = useRef<BugReportSheetHandle | null>(null);
  const sessionType = useAuthStore((state) => state.sessionType);
  const clearSession = useAuthStore((state) => state.clearSession);
  const handleResetSettings = useSettingsStore((state) => state.handleResetSettings);
  const {
    isToggle: isLogoutConfirmOpen,
    handleToggleOn: handleOpenLogoutConfirm,
    handleToggleOff: handleCloseLogoutConfirm,
  } = useToggle();
  const appVersion = Constants.expoConfig?.version ?? "-";

  const handlePressDisplay = () => {
    router.push("/settings/display");
  };

  const handlePressMenuActivation = () => {
    router.push("/settings/menu-activation");
  };

  const handlePressAppConnection = () => {
    router.push("/settings/app-connection");
  };

  const handlePressDesignSystem = () => {
    router.push("/settings/design-system" as Href);
  };

  const handlePressBugReport = () => {
    bugReportSheetRef.current?.openSheet();
  };

  const handlePressAnnouncement = () => {
    router.push("/announcement");
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
    router.replace("/");
  };

  return (
    <View className="flex-1 px-[2.4rem] pb-[2.8rem]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <SettingsRow
          label={t("settings.display.title")}
          onPress={handlePressDisplay}
        />
        <SettingsRow
          label={t("settings.menuActivation")}
          onPress={handlePressMenuActivation}
        />
        <SettingsRow
          label={t("settings.appConnection")}
          onPress={handlePressAppConnection}
        />
        {isDesignTokenLabEnabled ? (
          <SettingsRow
            label={t("settings.designSystem")}
            onPress={handlePressDesignSystem}
          />
        ) : null}
        <SettingsRow
          label={t("settings.bugReport")}
          onPress={handlePressBugReport}
        />
        <SettingsRow
          label={t("settings.announcement")}
          onPress={handlePressAnnouncement}
        />
        <SettingsRow
          label={t("settings.appVersion")}
          value={`v${appVersion}`}
        />
        {sessionType === "member" ? (
          <SettingsRow
            label={t("settings.logout")}
            onPress={handlePressLogout}
            textColor={dangerTextColor}
          />
        ) : sessionType === "guest" ? (
          <SettingsLoginContainer />
        ) : null}
      </ScrollView>

      <BugReportSheet ref={bugReportSheetRef} />

      <ConfirmModal
        isToggle={isLogoutConfirmOpen}
        title={t("settings.logoutConfirmTitle")}
        message={t("settings.logoutConfirmMessage")}
        completeText={t("settings.logout")}
        incompleteText={t("common.cancel")}
        handleToggleOff={handleCloseLogoutConfirm}
        onCompleteCheck={handleLogoutConfirmResult}
      />
    </View>
  );
}

export default SettingsScreen;
