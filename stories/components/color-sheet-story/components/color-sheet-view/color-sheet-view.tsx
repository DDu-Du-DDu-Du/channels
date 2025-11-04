import React, { useState } from "react";
import { Pressable, View } from "react-native";

import { ColorSheet, SpoqaText } from "@/components";
import { useToggle } from "@/hooks";

export interface ColorSheetViewProps {
  pickedColor?: string;
  disabled?: boolean;
  onClose?: () => void;
  onClick?: (color: string) => void;
}

function ColorSheetView({
  pickedColor = "#FF3B30",
  disabled,
  onClose,
  onClick,
}: ColorSheetViewProps) {
  const { isToggle, handleToggleOn, handleToggleOff } = useToggle();
  const [selected, setSelected] = useState<string>(pickedColor);

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Pressable
        onPress={handleToggleOn}
        className="px-4 py-2 rounded-radius10 mb-4"
        style={{ backgroundColor: selected }}
      >
        <SpoqaText className="text-white">Open ColorSheet</SpoqaText>
      </Pressable>
      <SpoqaText className="mb-2">Selected: {selected}</SpoqaText>

      <ColorSheet
        isShow={isToggle}
        pickedColor={selected}
        disabled={disabled}
        onClose={() => {
          onClose?.();
          handleToggleOff();
        }}
        onClick={(c) => {
          setSelected(c);
          onClick?.(c);
        }}
      />
    </View>
  );
}

export default ColorSheetView;
