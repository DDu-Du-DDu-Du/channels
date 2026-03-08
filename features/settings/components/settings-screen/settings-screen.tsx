import { useRef } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { ConfirmModal, SpoqaText } from "@/components";
import { useToggle } from "@/hooks";
import { ArrowLeftIcon } from "@/icons";
import { useAuthStore } from "@/stores";

import { BugReportSheet, BugReportSheetHandle } from "../bug-report-sheet";
import { SettingsRow } from "../settings-row";

import Constants from "expo-constants";
import { useRouter } from "expo-router";

function SettingsScreen() {
  const router = useRouter();
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

  const handleLogoutConfirmResult = (isComplete: boolean) => {
    if (!isComplete) {
      return;
    }

    // TODO: 로그아웃 서버 API 개발 후 fetch 로직 추가
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
            stroke="#1F1F1F"
          />
        </Pressable>
        <SpoqaText
          weight="bold"
          className="text-size18 text-black_500"
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
          textColor="#D64C4C"
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
