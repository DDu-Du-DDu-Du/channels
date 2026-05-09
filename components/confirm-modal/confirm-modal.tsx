import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import Modal from "@/components/modal/modal";
import SpoqaText from "@/components/spoqa-text/spoqa-text";

import { Image } from "expo-image";

export interface ConfirmModalProps {
  isToggle: boolean;
  title: string;
  message?: string;
  imageUrl?: string;
  completeText?: string;
  incompleteText?: string;
  handleToggleOff: () => void;
  onCompleteCheck: (isComplete: boolean) => void;
}

function ConfirmModal({
  isToggle,
  title,
  message,
  imageUrl,
  completeText,
  incompleteText,
  handleToggleOff,
  onCompleteCheck,
}: ConfirmModalProps) {
  const { t } = useTranslation();
  const handleClickComplete = () => {
    onCompleteCheck(true);
    handleToggleOff();
  };

  const handleClickIncomplete = () => {
    onCompleteCheck(false);
    handleToggleOff();
  };

  return (
    <Modal isToggle={isToggle}>
      <SpoqaText
        weight="semiBold"
        className="mb-[2rem] pt-[2.4rem] text-size15 text-center"
      >
        {title}
      </SpoqaText>
      {message && (
        <SpoqaText className="mb-[3.2rem] whitespace-pre-line text-size13 text-center">
          {message}
        </SpoqaText>
      )}
      {imageUrl && (
        <View className="relative w-[94%] mx-auto rounded-[1rem] max-w-[30rem] max-h-[31rem]">
          <Image
            className="mx-auto mb-[3.2rem]"
            source={imageUrl}
            alt={t("accessibility.alertImage")}
            style={{ width: 300, height: 310 }}
            priority="high"
          />
        </View>
      )}
      <View className="flex-row gap-[1rem] px-[1rem] pb-[1rem]">
        <Pressable
          className="h-[5.2rem] flex-1 items-center justify-center rounded-[1rem] bg-role-surface-panel dark:bg-role-dark-surface-panel"
          onPress={handleClickComplete}
        >
          <SpoqaText
            weight="semiBold"
            className="text-size15"
          >
            {completeText ?? t("common.confirm")}
          </SpoqaText>
        </Pressable>
        <Pressable
          className="h-[5.2rem] flex-1 items-center justify-center rounded-[1rem] bg-role-surface-panel dark:bg-role-dark-surface-panel"
          onPress={handleClickIncomplete}
        >
          <SpoqaText
            weight="semiBold"
            className="text-size15"
          >
            {incompleteText ?? t("common.cancel")}
          </SpoqaText>
        </Pressable>
      </View>
    </Modal>
  );
}

export default ConfirmModal;
