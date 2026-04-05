import { useState } from "react";
import { View } from "react-native";

import { useOauth2Login } from "@/features/auth";
import LoginButton from "@/features/auth/components/login-button/login-button";

import Button from "../button/Button";
import ConfirmModal from "../confirm-modal/confirm-modal";
import EmptyList from "../empty-list/empty-list";
import Modal from "../modal/modal";

export interface MemberGuideProps {
  text?: string;
  className?: string;
  ctaLabel?: string;
  showGuideText?: boolean;
}

const DEFAULT_TEXT = "회원 전용입니다. 로그인 후 더 많은 서비스를 경험하세요!";
const SYNC_CONFIRM_MESSAGE =
  "게스트로 작성했던 정보들을 모두 동기화 시킬까요? \n아니요를 누르면 게스트로 작성했던 정보가 모두 초기화 돼요.";

function MemberGuide({
  text = DEFAULT_TEXT,
  className,
  ctaLabel = "로그인",
  showGuideText = true,
}: MemberGuideProps) {
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
            text={text}
            className="w-full items-center py-0"
          />
        ) : null}
        <Button
          label={ctaLabel}
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
            label="카카오 로그인"
            onPress={handleOpenSyncConfirm}
            fit={true}
          />
          <Button
            label="닫기"
            onPress={handleCloseLoginModal}
            className="mt-[0.8rem]"
          />
        </View>
      </Modal>

      <ConfirmModal
        isToggle={isSyncConfirmOpen}
        title="일정 동기화"
        message={SYNC_CONFIRM_MESSAGE}
        completeText="예"
        incompleteText="아니오"
        handleToggleOff={handleCloseSyncConfirm}
        onCompleteCheck={handleConfirmSync}
      />
    </>
  );
}

export default MemberGuide;
