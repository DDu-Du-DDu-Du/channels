import { useRef } from "react";
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
          label="화면 표시"
          onPress={handlePressDisplay}
        />
        <SettingsRow
          label="메뉴 활성화"
          onPress={handlePressMenuActivation}
        />
        <SettingsRow
          label="앱 연결"
          onPress={handlePressAppConnection}
        />
        {isDesignTokenLabEnabled ? (
          <SettingsRow
            label="디자인 시스템"
            onPress={handlePressDesignSystem}
          />
        ) : null}
        <SettingsRow
          label="버그 리포트"
          onPress={handlePressBugReport}
        />
        <SettingsRow
          label="공지사항"
          onPress={handlePressAnnouncement}
        />
        <SettingsRow
          label="앱 버전 정보"
          value={`v${appVersion}`}
        />
        {sessionType === "member" ? (
          <SettingsRow
            label="로그아웃"
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
        title="로그아웃하시겠어요?"
        message="현재 계정에서 로그아웃됩니다."
        completeText="로그아웃"
        incompleteText="취소"
        handleToggleOff={handleCloseLogoutConfirm}
        onCompleteCheck={handleLogoutConfirmResult}
      />
    </View>
  );
}

export default SettingsScreen;
