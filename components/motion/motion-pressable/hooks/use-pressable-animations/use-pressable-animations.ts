import type { ViewStyle } from "react-native";
import { type SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

interface WhileTapConfig {
  scale?: number;
  opacity?: number;
}

interface WhileHoverConfig {
  opacity?: number;
}

export interface UsePressableAnimationsParams {
  disabled?: boolean;
  pressed: SharedValue<boolean>;
  hovered: SharedValue<boolean>;
  whileTap?: WhileTapConfig;
  whileHover?: WhileHoverConfig;
  highlightTapOpacity: number;
  highlightHoverOpacity: number;
}

export default function usePressableAnimations({
  disabled,
  pressed,
  hovered,
  whileTap,
  highlightTapOpacity,
  highlightHoverOpacity,
}: UsePressableAnimationsParams) {
  const animatedContainerStyle = useAnimatedStyle(() => {
    const scale = disabled
      ? 1
      : withTiming(pressed.value && whileTap?.scale ? whileTap.scale : 1, { duration: 120 });
    return { transform: [{ scale }] } as ViewStyle;
  }, [disabled]);

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    if (disabled) {
      return { opacity: 0.6 };
    }

    const opacity = pressed.value
      ? withTiming(highlightTapOpacity, { duration: 120 })
      : hovered.value
        ? withTiming(highlightHoverOpacity, { duration: 120 })
        : withTiming(0, { duration: 120 });
    return { opacity: opacity } as ViewStyle;
  }, [disabled, highlightTapOpacity, highlightHoverOpacity]);

  return { animatedContainerStyle, overlayAnimatedStyle };
}
