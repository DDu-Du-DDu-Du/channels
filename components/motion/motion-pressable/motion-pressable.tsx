import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { useThemeColorToken } from "@/hooks/use-theme-color";

import { usePressableAnimations } from "./hooks";

export interface MotionPressableProps {
  style?: StyleProp<ViewStyle>;
  whileTap?: { scale?: number; opacity?: number };
  whileHover?: { opacity?: number };
  disabled?: boolean;
  children: React.ReactNode;
  accessibilityRole?: string;
  onPress?: () => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  highlightColor?: string;
  highlightTapOpacity?: number;
  highlightHoverOpacity?: number;
}

function MotionPressable({
  style,
  whileTap,
  whileHover,
  disabled,
  children,
  accessibilityRole,
  onPress,
  onHoverIn,
  onHoverOut,
  highlightColor,
  highlightTapOpacity = 0.06,
  highlightHoverOpacity = 0.03,
}: MotionPressableProps) {
  const defaultHighlightColor = useThemeColorToken("role.surface.inverse");
  const resolvedHighlightColor = highlightColor ?? defaultHighlightColor;
  const pressed = useSharedValue(false);
  const hovered = useSharedValue(false);

  const { animatedContainerStyle, overlayAnimatedStyle } = usePressableAnimations({
    disabled,
    pressed,
    hovered,
    whileTap,
    whileHover,
    highlightTapOpacity,
    highlightHoverOpacity,
  });

  const tap = Gesture.Tap()
    .maxDuration(10_000)
    .enabled(!disabled)
    .onBegin(() => {
      pressed.value = true;
    })
    .onFinalize(() => {
      pressed.value = false;
    })
    .onEnd(() => {
      if (onPress) {
        scheduleOnRN(onPress);
      }
    });

  const hover = Gesture.Hover()
    .enabled(!disabled)
    .onBegin(() => {
      hovered.value = true;

      if (onHoverIn) {
        scheduleOnRN(onHoverIn);
      }
    })
    .onFinalize(() => {
      hovered.value = false;

      if (onHoverOut) {
        scheduleOnRN(onHoverOut);
      }
    });

  return (
    <GestureDetector gesture={Gesture.Race(tap, hover)}>
      <Animated.View
        accessibilityRole={accessibilityRole as any}
        style={[animatedContainerStyle, style]}
      >
        {children}
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: resolvedHighlightColor, borderRadius: 10, pointerEvents: "none" },
            overlayAnimatedStyle,
          ]}
        />
      </Animated.View>
    </GestureDetector>
  );
}

export default MotionPressable;
