import { Pressable, View } from "react-native";

import { Modal, SpoqaText } from "@/components";

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
  completeText = "확인",
  incompleteText = "취소",
  handleToggleOff,
  onCompleteCheck,
}: ConfirmModalProps) {
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
            alt="경고(알림) 이미지입니다."
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
            {completeText}
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
            {incompleteText}
          </SpoqaText>
        </Pressable>
      </View>
    </Modal>
  );
}

export default ConfirmModal;
