import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface HamburgerToggleProps {
  isOpen: boolean;
  onPress: () => void;
}

function HamburgerToggle({ isOpen, onPress }: HamburgerToggleProps) {
  const progress = useSharedValue(isOpen ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isOpen ? 1 : 0, {
      duration: 220,
      easing: Easing.linear,
    });
  }, [isOpen, progress]);

  const topLineAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, 7]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, 45])}deg` },
    ],
  }));

  const middleLineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0]),
  }));

  const bottomLineAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -7]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, -45])}deg` },
    ],
  }));

  return (
    <Pressable
      onPress={onPress}
      className="h-[2.4rem] w-[2.4rem] items-center justify-center"
    >
      <View style={styles.iconContainer}>
        <Animated.View style={[styles.line, topLineAnimatedStyle]} />
        <Animated.View style={[styles.line, middleLineAnimatedStyle]} />
        <Animated.View style={[styles.line, bottomLineAnimatedStyle]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 20,
    height: 16,
    justifyContent: "space-between",
  },
  line: {
    width: 20,
    height: 2,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
});

export default HamburgerToggle;
