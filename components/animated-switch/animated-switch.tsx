import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export interface AnimatedSwitchProps {
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  className?: string;
}

function AnimatedSwitch({ value, onValueChange, disabled, className }: AnimatedSwitchProps) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 150 });
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: progress.value > 0.5 ? "#1363DE" : "#E1E1E1",
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(progress.value * 20) }],
  }));

  const handlePress = () => {
    if (disabled) return;
    onValueChange(!value);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ checked: value, disabled }}
      onPress={handlePress}
      disabled={disabled}
      className={className}
    >
      <Animated.View
        className="w-[44px] h-[28px] rounded-radius15 justify-center"
        style={trackStyle}
      >
        <View className="px-[4px]">
          <Animated.View
            className="w-[20px] h-[20px] rounded-circle bg-white_100"
            style={thumbStyle}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default AnimatedSwitch;
