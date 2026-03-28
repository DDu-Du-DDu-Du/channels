import { Pressable, View } from "react-native";

import Modal from "@/components/modal/modal";
import SpoqaText from "@/components/spoqa-text/spoqa-text";

import { Image } from "expo-image";

export interface AlertModalProps {
  isToggle: boolean;
  title: string;
  message?: string;
  imageUrl?: string;
  completeText?: string;
  handleToggleOff: () => void;
}

function AlertModal({
  isToggle,
  title,
  message,
  imageUrl,
  completeText = "확인",
  handleToggleOff,
}: AlertModalProps) {
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
      <Pressable
        className="mx-auto mb-[0.9rem] h-[5.2rem] w-[94%] items-center justify-center rounded-[1rem] bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg"
        onPress={handleToggleOff}
      >
        <SpoqaText
          weight="semiBold"
          className="text-role-text-inverse dark:text-role-dark-text-inverse text-size15"
        >
          {completeText}
        </SpoqaText>
      </Pressable>
    </Modal>
  );
}

export default AlertModal;
