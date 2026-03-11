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
  size?: number;
  borderStrokeAlpha?: number;
  onPress: () => void;
  accessibilityRole?: "checkbox";
}

function ShakingCheckIcon({
  isChecked,
  color,
  size = 24,
  borderStrokeAlpha = 0.45,
  onPress,
  accessibilityRole = "checkbox",
}: ShakingCheckIconProps) {
  const checkRotate = useSharedValue(0);
  const uncheckedFillColor = useThemeColorToken("role.icon.muted");
  const borderStrokeColor = hexConvertForRGBA({ hex: color, alpha: borderStrokeAlpha });

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
          fill={isChecked ? `#${color}` : uncheckedFillColor}
          stroke={borderStrokeColor}
          strokeWidth={1.25}
        />
      </Animated.View>
    </Pressable>
  );
}

export default ShakingCheckIcon;
