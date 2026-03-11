import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { SpoqaText } from "@/components";

interface DayOfWeekBarProps {
  label: string;
  ratio: number;
  color: string;
  durationMs?: number;
}

const BAR_HEIGHT = 68;
const BAR_RADIUS = 15;

function DayOfWeekBar({ label, ratio, color, durationMs = 450 }: DayOfWeekBarProps) {
  const safeRatio = Number.isNaN(ratio) ? 0 : Math.max(0, Math.min(100, ratio));
  const animatedHeight = useSharedValue(0);

  useEffect(() => {
    animatedHeight.value = 0;
    animatedHeight.value = withTiming((safeRatio / 100) * BAR_HEIGHT, {
      duration: durationMs,
      easing: Easing.out(Easing.cubic),
    });
  }, [animatedHeight, durationMs, safeRatio]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  return (
    <View className="items-center gap-[0.6rem]">
      <View
        className="w-[3.2rem] overflow-hidden bg-role-surface-subtle dark:bg-role-dark-surface-subtle"
        style={styles.track}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              borderTopLeftRadius: safeRatio >= 99 ? BAR_RADIUS : 0,
              borderTopRightRadius: safeRatio >= 99 ? BAR_RADIUS : 0,
            },
            animatedStyle,
          ]}
        />
      </View>
      <SpoqaText className="text-size12 text-role-text-tertiary dark:text-role-dark-text-tertiary">
        {label}
      </SpoqaText>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: BAR_HEIGHT,
    borderRadius: BAR_RADIUS,
  },
  fill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomLeftRadius: BAR_RADIUS,
    borderBottomRightRadius: BAR_RADIUS,
  },
});

export default DayOfWeekBar;
