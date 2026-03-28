import React from "react";
import { Pressable, View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";

interface SheetRadioItemProps {
  label: string;
  icon?: React.ReactNode;
  checked: boolean;
  onPress: () => void;
}

function SheetRadioItem({ label, icon, checked, onPress }: SheetRadioItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="py-[4px]"
      accessibilityRole="radio"
      accessibilityState={{ checked }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {icon}
          <SpoqaText className="ml-[1rem]">{label}</SpoqaText>
        </View>
        <View
          className="w-[24px] h-[24px] rounded-full ml-[8px]"
          style={{
            borderWidth: 2,
            borderColor: checked ? "#1363de" : "#ccc",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {checked ? (
            <View
              className="w-[16px] h-[16px] rounded-full"
              style={{ backgroundColor: "#1363de" }}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export default SheetRadioItem;
