import React from "react";
import { DimensionValue, Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { remToPx } from "@/utils";

export interface SelectOptionProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  width?: DimensionValue;
  className?: string;
  onPress: () => void;
}

function SelectOption({
  children,
  backgroundColor = "#F5F5F5",
  width,
  className = "",
  onPress,
}: SelectOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`relative pl-[1.4rem] pr-[2.4rem] py-[1rem] rounded-[1rem] ${className}`}
      style={{ backgroundColor, width }}
    >
      <SpoqaText className="inline-block text-size13 leading-[1.3rem]">{children}</SpoqaText>

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: "50%",
          right: remToPx("1.1rem"),
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderTopWidth: remToPx("0.4rem"),
          borderTopColor: "#D9D9D9", // example_gray_700
          borderLeftWidth: remToPx("0.3rem"),
          borderRightWidth: remToPx("0.3rem"),
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          transform: [{ translateY: -0.5 * remToPx("1rem") }],
        }}
      />
    </Pressable>
  );
}

export default SelectOption;
