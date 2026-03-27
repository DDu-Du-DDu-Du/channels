import { useRef } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { ConfirmModal, SpoqaText } from "@/components";
import { useToggle } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ArrowLeftIcon } from "@/icons";
import { logout } from "@/service/auth/auth";
import { useAuthStore } from "@/stores";

import { BugReportSheet, BugReportSheetHandle } from "../bug-report-sheet";
import { SettingsRow } from "../settings-row";

import Constants from "expo-constants";
import { useRouter } from "expo-router";

function SettingsScreen() {
  const router = useRouter();
  const iconStroke = useThemeColorToken("role.icon.default");
  const dangerTextColor = useThemeColorToken("role.status.error");
  const bugReportSheetRef = useRef<BugReportSheetHandle | null>(null);
  const clearSession = useAuthStore((state) => state.clearSession);
  const {
    isToggle: isLogoutConfirmOpen,
    handleToggleOn: handleOpenLogoutConfirm,
    handleToggleOff: handleCloseLogoutConfirm,
  } = useToggle();
  const appVersion = Constants.expoConfig?.version ?? "-";

  const handlePressBack = () => {
    router.back();
  };

  const handlePressDisplay = () => {
    router.push("/settings/display");
  };

  const handlePressMenuActivation = () => {
    router.push("/settings/menu-activation");
  };

  const handlePressAppConnection = () => {
    router.push("/settings/app-connection");
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

    try {
      await logout();
    } catch {
      // Ignore logout API failure and continue local sign-out.
    }

    clearSession();
    router.replace("/");
  };

  return (
    <View className="flex-1 px-[2.4rem] pb-[2.8rem] pt-[2.4rem]">
      <View className="relative items-center justify-center pb-[2.8rem]">
        <Pressable
          onPress={handlePressBack}
          className="absolute left-0 top-0 size-[2.4rem] items-start justify-center"
          hitSlop={8}
        >
          <ArrowLeftIcon
            size={16}
            stroke={iconStroke}
          />
        </Pressable>
        <SpoqaText
          weight="bold"
          className="text-size18 text-role-text-primary dark:text-role-dark-text-primary"
        >
          설정
        </SpoqaText>
      </View>

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
        <SettingsRow
          label="로그아웃"
          onPress={handlePressLogout}
          textColor={dangerTextColor}
        />
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
