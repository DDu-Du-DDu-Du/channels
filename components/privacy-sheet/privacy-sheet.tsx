import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { Pressable, View } from "react-native";

import { BottomSheet, SpoqaText } from "@/components";
import { useBottomSheetAction } from "@/hooks";
import { FollowerIcon, PrivacyIcon, PublicIcon } from "@/icons";
import { GoalPrivacyType } from "@/types/response/goal/goal";

import { PrivacyTypeController } from "./components";
import usePrivacySheet from "./hooks/use-privacy-sheet/use-privacy-sheet";
import { PrivacyItemType } from "./privacy-sheet.types";

export interface PrivacySheetProps {
  goalPrivacy: GoalPrivacyType;
  isShow: boolean;
  onClose: () => void;
  onClick: (goalPrivacy: GoalPrivacyType) => void;
}

export const PRIVACY_LIST: PrivacyItemType[] = [
  {
    id: "public",
    icon: <PublicIcon />,
    label: "전체공개",
    name: "privacyType",
    value: "PUBLIC",
  },
  {
    id: "follower",
    icon: <FollowerIcon />,
    label: "팔로워 공개",
    name: "privacyType",
    value: "FOLLOWER",
  },
  {
    id: "private",
    icon: <PrivacyIcon />,
    label: "나만보기",
    name: "privacyType",
    value: "PRIVATE",
  },
];

function PrivacySheet({ goalPrivacy, isShow, onClose, onClick }: PrivacySheetProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();
  const handleComposedSubmit = (privacyType: GoalPrivacyType) => {
    onClick(privacyType);
    closeSheet();
  };
  const { methods, handlePrivacySubmit } = usePrivacySheet({
    goalPrivacy,
    onSubmit: handleComposedSubmit,
  });

  useEffect(() => {
    if (isShow) {
      openSheet();
    }
  }, [isShow, openSheet]);

  return (
    <BottomSheet
      ref={ref}
      onClose={onClose}
      fitContent
    >
      <FormProvider {...methods}>
        <View className="box-border bg-role-surface-panel p-[2rem] dark:bg-role-dark-surface-panel">
          <PrivacyTypeController list={PRIVACY_LIST} />
          <Pressable
            className="w-full h-[5.6rem] bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg rounded-radius15 items-center justify-center"
            onPress={handlePrivacySubmit}
          >
            <SpoqaText
              weight="semiBold"
              className="text-role-text-inverse dark:text-role-dark-text-inverse"
            >
              확인
            </SpoqaText>
          </Pressable>
        </View>
      </FormProvider>
    </BottomSheet>
  );
}

export default PrivacySheet;
