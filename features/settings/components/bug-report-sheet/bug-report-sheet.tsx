import { forwardRef, useImperativeHandle, useRef } from "react";
import { Pressable, View } from "react-native";

import { BottomSheet, Button, ConfirmModal, SpoqaText } from "@/components";
import { useToast } from "@/components/toast/hooks";
import { useBottomSheetAction, useToggle } from "@/hooks";
import { ArrowLeftIcon } from "@/icons";

import { BugReportForm, BugReportFormHandle } from "./components";

export interface BugReportSheetHandle {
  openSheet: () => void;
  closeSheet: () => void;
}

const BugReportSheet = forwardRef<BugReportSheetHandle>(function BugReportSheet(_, ref) {
  const { ref: bottomSheetRef, openSheet, closeSheet } = useBottomSheetAction();
  const { createToast } = useToast();
  const bugReportFormRef = useRef<BugReportFormHandle | null>(null);
  const {
    isToggle: isDismissConfirmOpen,
    handleToggleOn: handleOpenDismissConfirm,
    handleToggleOff: handleCloseDismissConfirm,
  } = useToggle();

  useImperativeHandle(
    ref,
    () => ({
      openSheet,
      closeSheet,
    }),
    [closeSheet, openSheet],
  );

  const handleRequestDismiss = () => {
    if (!bugReportFormRef.current?.hasDraft()) {
      closeSheet();
      return;
    }

    handleOpenDismissConfirm();
  };

  const handleSubmitReport = () => {
    bugReportFormRef.current?.handleSubmit();
  };

  const handleSubmitAction = () => {
    // TODO: Submit bug report API.
  };

  const handleSubmitForm = () => {
    handleSubmitAction();
    createToast("제보되었어요. 더 나은 앱을 만드는 데 도움 주셔서 감사해요.", { type: "safe" });
    bugReportFormRef.current?.handleReset();
    closeSheet();
  };

  const handleDismissConfirmResult = (isComplete: boolean) => {
    if (!isComplete) {
      return;
    }

    bugReportFormRef.current?.handleReset();
    closeSheet();
  };

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        defaultHeight="90%"
        maxHeight="90%"
        enablePanDownToClose={false}
        backdropPressBehavior="collapse"
        onBackdropPress={handleRequestDismiss}
      >
        <View className="flex h-full bg-role-surface-panel dark:bg-role-dark-surface-panel px-[2rem] pb-[2.2rem] pt-[1.8rem]">
          <View className="relative items-center justify-center pb-[2rem]">
            <Pressable
              onPress={handleRequestDismiss}
              hitSlop={8}
              className="absolute left-0 top-0 size-[2.4rem] items-start justify-center"
            >
              <ArrowLeftIcon
                size={16}
                stroke="#1F1F1F"
              />
            </Pressable>
            <SpoqaText
              weight="bold"
              className="text-size17 text-role-text-primary dark:text-role-dark-text-primary"
            >
              버그리포트 제보
            </SpoqaText>
          </View>

          <BugReportForm
            ref={bugReportFormRef}
            onSubmit={handleSubmitForm}
          />

          <Button
            label="제보하기"
            onPress={handleSubmitReport}
            className="mt-[1.2rem]"
            bodyClassName="bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg"
            labelClassName="text-role-text-inverse dark:text-role-dark-text-inverse"
          />
        </View>
      </BottomSheet>

      <ConfirmModal
        isToggle={isDismissConfirmOpen}
        title="작성 중인 제보 작성을 취소할까요?"
        message="작성한 제목/내용/이미지가 사라집니다."
        completeText="작성 취소"
        incompleteText="계속 작성"
        handleToggleOff={handleCloseDismissConfirm}
        onCompleteCheck={handleDismissConfirmResult}
      />
    </>
  );
});

export default BugReportSheet;
