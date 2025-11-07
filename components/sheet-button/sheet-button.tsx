import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { MotionPressable } from "@/components/motion";
import SpoqaText from "@/components/spoqa-text/spoqa-text";

import { useSheetButtonStyle } from "./hooks";

export interface SheetButtonProps {
  Icon: React.ReactNode;
  title: string;
  buttonType?: "main" | "sub";
  rightPlace?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
}

function SheetButton({
  Icon,
  title,
  buttonType = "main",
  rightPlace,
  style,
  onPress,
  disabled = false,
}: SheetButtonProps) {
  const { containerStyle, innerStyle, contentStyle, titleStyle } = useSheetButtonStyle({
    buttonType,
  });

  return (
    <MotionPressable
      accessibilityRole="button"
      whileTap={disabled ? undefined : { scale: 0.95, opacity: 0.7 }}
      whileHover={disabled ? undefined : { opacity: 0.9 }}
      style={[containerStyle, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={innerStyle}>
        <View style={contentStyle}>
          {Icon}
          <SpoqaText style={titleStyle}>{title}</SpoqaText>
        </View>
        {buttonType === "sub" && rightPlace && (
          <View style={{ marginLeft: "auto" }}>{rightPlace}</View>
        )}
      </View>
    </MotionPressable>
  );
}

export default SheetButton;
