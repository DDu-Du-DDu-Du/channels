import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { useOauth2Login } from "@/features/auth";
import LoginButton from "@/features/auth/components/login-button/login-button";

import Button from "../button/button";
import ConfirmModal from "../confirm-modal/confirm-modal";
import EmptyList from "../empty-list/empty-list";
import Modal from "../modal/modal";

export interface MemberGuideProps {
  text?: string;
  className?: string;
  ctaLabel?: string;
  showGuideText?: boolean;
}

function MemberGuide({ text, className, ctaLabel, showGuideText = true }: MemberGuideProps) {
  const { t } = useTranslation();
  const { handleKakaoLogin } = useOauth2Login({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSyncConfirmOpen, setIsSyncConfirmOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleOpenSyncConfirm = () => {
    setIsSyncConfirmOpen(true);
  };

  const handleCloseSyncConfirm = () => {
    setIsSyncConfirmOpen(false);
  };

  const handleConfirmSync = async (isComplete: boolean) => {
    if (isComplete) {
      // TODO: 동기화 작업 구현
    }

    await handleKakaoLogin();
    handleCloseSyncConfirm();
    handleCloseLoginModal();
  };

  return (
    <>
      <View className={className ?? "flex-1 items-center justify-center px-[2.4rem]"}>
        {showGuideText ? (
          <EmptyList
            text={text ?? t("auth.memberOnly")}
            className="w-full items-center py-0"
          />
        ) : null}
        <Button
          label={ctaLabel ?? t("auth.login")}
          onPress={handleOpenLoginModal}
          className={`${showGuideText ? "mt-[1.2rem]" : ""} w-full max-w-[16rem]`}
          bodyClassName="bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg"
          labelClassName="text-role-text-inverse dark:text-role-dark-text-inverse"
        />
      </View>

      <Modal
        isToggle={isLoginModalOpen}
        width={320}
      >
        <View className="px-[2rem] pb-[2rem] pt-[2.4rem]">
          <LoginButton
            provider="kakao"
            label={t("auth.kakaoLogin")}
            onPress={handleOpenSyncConfirm}
            fit={true}
          />
          <Button
            label={t("common.close")}
            onPress={handleCloseLoginModal}
            className="mt-[0.8rem]"
          />
        </View>
      </Modal>

      <ConfirmModal
        isToggle={isSyncConfirmOpen}
        title={t("auth.syncScheduleTitle")}
        message={t("auth.syncGuestMessage")}
        completeText={t("common.yes")}
        incompleteText={t("common.no")}
        handleToggleOff={handleCloseSyncConfirm}
        onCompleteCheck={handleConfirmSync}
      />
    </>
  );
}

export default MemberGuide;
