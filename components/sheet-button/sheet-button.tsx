import React from "react";
import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native";

import { MotionPressable } from "@/components/motion";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { useThemeColorToken } from "@/hooks/use-theme-color";

import { useSheetButtonStyle } from "./hooks";

export interface SheetButtonProps {
  Icon: React.ReactNode;
  title: string;
  buttonType?: "main" | "sub";
  rightPlace?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

function SheetButton({
  Icon,
  title,
  buttonType = "main",
  rightPlace,
  style,
  onPress,
  disabled = false,
  isLoading = false,
}: SheetButtonProps) {
  const { containerStyle, innerStyle, contentStyle, titleStyle } = useSheetButtonStyle({
    buttonType,
  });
  const loadingColor = useThemeColorToken("role.text.primary");
  const isDisabled = disabled || isLoading;

  return (
    <MotionPressable
      accessibilityRole="button"
      whileTap={isDisabled ? undefined : { scale: 0.95, opacity: 0.7 }}
      whileHover={isDisabled ? undefined : { opacity: 0.9 }}
      style={[containerStyle, style]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <View style={innerStyle}>
        <View style={contentStyle}>
          {isLoading ? (
            <ActivityIndicator color={loadingColor} />
          ) : (
            <>
              {Icon}
              <SpoqaText style={titleStyle}>{title}</SpoqaText>
            </>
          )}
        </View>
        {buttonType === "sub" && rightPlace && (
          <View style={{ marginLeft: "auto" }}>{rightPlace}</View>
        )}
      </View>
    </MotionPressable>
  );
}

export default SheetButton;
