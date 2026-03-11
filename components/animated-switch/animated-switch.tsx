import { useEffect, useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useThemeColorToken } from "@/hooks/use-theme-color";

type SwitchSize = "default" | "large";

export interface AnimatedSwitchProps {
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: SwitchSize;
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
  onBackgroundColor?: string;
  offBackgroundColor?: string;
  thumbColor?: string;
  onThumbColor?: string;
  offThumbColor?: string;
  trackWidth?: number;
  trackHeight?: number;
  trackPadding?: number;
  thumbSize?: number;
}

function AnimatedSwitch({
  value,
  onValueChange,
  disabled,
  className,
  size = "default",
  onIcon,
  offIcon,
  onBackgroundColor,
  offBackgroundColor,
  thumbColor,
  onThumbColor,
  offThumbColor,
  trackWidth,
  trackHeight,
  trackPadding,
  thumbSize,
}: AnimatedSwitchProps) {
  const defaultOnBackground = useThemeColorToken("role.surface.muted");
  const defaultOffBackground = useThemeColorToken("role.surface.subtle");
  const defaultThumbColor = useThemeColorToken("role.surface.canvas");
  const onBackground = onBackgroundColor ?? defaultOnBackground;
  const offBackground = offBackgroundColor ?? defaultOffBackground;
  const onThumb = onThumbColor ?? defaultThumbColor;
  const offThumb = offThumbColor ?? defaultThumbColor;

  const sizePreset = useMemo(
    () =>
      size === "large"
        ? { trackWidth: 56, trackHeight: 34, trackPadding: 4, thumbSize: 26 }
        : { trackWidth: 44, trackHeight: 28, trackPadding: 4, thumbSize: 20 },
    [size],
  );

  const resolvedTrackWidth = trackWidth ?? sizePreset.trackWidth;
  const resolvedTrackHeight = trackHeight ?? sizePreset.trackHeight;
  const resolvedTrackPadding = trackPadding ?? sizePreset.trackPadding;
  const resolvedThumbSize = thumbSize ?? sizePreset.thumbSize;

  const progress = useSharedValue(value ? 1 : 0);

  const travelDistance = useMemo(
    () => resolvedTrackWidth - resolvedTrackPadding * 2 - resolvedThumbSize,
    [resolvedThumbSize, resolvedTrackPadding, resolvedTrackWidth],
  );

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 100 });
  }, [progress, value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [offBackground, onBackground]),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    backgroundColor: thumbColor
      ? thumbColor
      : interpolateColor(progress.value, [0, 1], [offThumb, onThumb]),
    transform: [{ translateX: withTiming(progress.value * travelDistance, { duration: 150 }) }],
  }));

  const offIconStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1 - progress.value, { duration: 120 }),
  }));

  const onIconStyle = useAnimatedStyle(() => ({
    opacity: withTiming(progress.value, { duration: 120 }),
  }));

  const handlePress = () => {
    if (disabled) {
      return;
    }

    onValueChange(!value);
  };

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      onPress={handlePress}
      disabled={disabled}
      className={className}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: resolvedTrackWidth,
            height: resolvedTrackHeight,
            borderRadius: resolvedTrackHeight / 2,
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: resolvedThumbSize,
              height: resolvedThumbSize,
              borderRadius: resolvedThumbSize / 2,
              left: resolvedTrackPadding,
              top: (resolvedTrackHeight - resolvedThumbSize) / 2,
            },
            thumbStyle,
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[styles.thumbIcon, offIconStyle]}
          >
            {offIcon}
          </Animated.View>
          <Animated.View
            pointerEvents="none"
            style={[styles.thumbIcon, onIconStyle]}
          >
            {onIcon}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    position: "relative",
    justifyContent: "center",
  },
  thumb: {
    position: "absolute",
    zIndex: 1,
    elevation: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbIcon: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AnimatedSwitch;
