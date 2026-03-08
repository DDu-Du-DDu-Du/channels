import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { ArrowLeftIcon } from "@/icons";

import { MenuActivationDraggableList } from "./components";

import { useRouter } from "expo-router";

export interface MenuActivationSettingsScreenProps {
  isValidationEnabled?: boolean;
  onValidationError?: () => void;
}

function MenuActivationSettingsScreen({
  isValidationEnabled = true,
  onValidationError,
}: MenuActivationSettingsScreenProps) {
  const router = useRouter();

  const handlePressBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 pb-[2.8rem] pt-[2.4rem]">
      <View className="relative items-center justify-center px-[2.4rem] pb-[2.8rem]">
        <Pressable
          onPress={handlePressBack}
          className="absolute left-[2.4rem] top-0 size-[2.4rem] items-start justify-center"
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
          메뉴 활성화
        </SpoqaText>
      </View>

      <MenuActivationDraggableList
        isValidationEnabled={isValidationEnabled}
        onValidationError={onValidationError}
      />
    </View>
  );
}

export default MenuActivationSettingsScreen;
