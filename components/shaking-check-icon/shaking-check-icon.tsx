import { Pressable } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useThemeColorToken } from "@/hooks/use-theme-color";
import { CheckIcon } from "@/icons";
import { hexConvertForRGBA } from "@/utils";

export interface ShakingCheckIconProps {
  isChecked: boolean;
  color: string;
  uncheckedColor?: string;
  size?: number;
  borderStrokeAlpha?: number;
  onPress: () => void;
  accessibilityRole?: "checkbox";
}

function ShakingCheckIcon({
  isChecked,
  color,
  uncheckedColor,
  size = 24,
  borderStrokeAlpha = 0.45,
  onPress,
  accessibilityRole = "checkbox",
}: ShakingCheckIconProps) {
  const checkRotate = useSharedValue(0);
  const mutedUncheckedFillColor = useThemeColorToken("role.icon.muted");
  const unresolvedUncheckedColor = uncheckedColor ?? mutedUncheckedFillColor;
  const resolvedCheckedColor = color.startsWith("#") ? color.slice(1) : color;
  const resolvedUncheckedColor = unresolvedUncheckedColor.startsWith("#")
    ? unresolvedUncheckedColor.slice(1)
    : unresolvedUncheckedColor;
  const activeColor = isChecked ? resolvedCheckedColor : resolvedUncheckedColor;
  const borderStrokeColor = hexConvertForRGBA({ hex: activeColor, alpha: borderStrokeAlpha });

  const checkboxIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${checkRotate.value}deg` }],
  }));

  const handlePressCheckIcon = () => {
    checkRotate.value = withSequence(
      withTiming(-12, { duration: 135, easing: Easing.out(Easing.quad) }),
      withTiming(12, { duration: 160, easing: Easing.out(Easing.quad) }),
      withTiming(-8, { duration: 125, easing: Easing.out(Easing.quad) }),
      withTiming(8, { duration: 115, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 145, easing: Easing.out(Easing.quad) }),
    );
    onPress();
  };

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityState={{ checked: isChecked }}
      className="items-center justify-center"
      onPress={handlePressCheckIcon}
    >
      <Animated.View style={checkboxIconStyle}>
        <CheckIcon
          size={size}
          fill={`#${activeColor}`}
          stroke={borderStrokeColor}
          strokeWidth={1.25}
        />
      </Animated.View>
    </Pressable>
  );
}

export default ShakingCheckIcon;
