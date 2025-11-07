import { useState } from "react";
import { Pressable, View } from "react-native";

import { PrivacySheet, SpoqaText } from "@/components";
import { useToggle } from "@/hooks";
import type { GoalPrivacyType } from "@/types/response/goal/goal";

export interface PrivacySheetViewProps {
  goalPrivacy?: GoalPrivacyType;
  onClose?: () => void;
  onClick?: (value: GoalPrivacyType) => void;
}

function PrivacySheetView({ goalPrivacy = "PUBLIC", onClose, onClick }: PrivacySheetViewProps) {
  const { isToggle, handleToggleOn, handleToggleOff } = useToggle();
  const [selected, setSelected] = useState<GoalPrivacyType>(goalPrivacy);

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Pressable
        onPress={handleToggleOn}
        className="px-4 py-2 bg-example_gray_700 rounded-radius10 mb-4"
      >
        <SpoqaText className="text-white">Open PrivacySheet</SpoqaText>
      </Pressable>
      <SpoqaText className="mb-2">Selected: {selected}</SpoqaText>

      <PrivacySheet
        goalPrivacy={selected}
        isShow={isToggle}
        onClose={() => {
          onClose?.();
          handleToggleOff();
        }}
        onClick={(v) => {
          setSelected(v);
          onClick?.(v);
        }}
      />
    </View>
  );
}

export default PrivacySheetView;
