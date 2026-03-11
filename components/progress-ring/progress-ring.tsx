import { useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { useThemeColorToken } from "@/hooks/use-theme-color";

export interface ProgressRingProps {
  percent: number;
  color: string;
  size: number;
  strokeWidth: number;
  trackColor?: string;
  animate?: boolean;
  durationMs?: number;
  animationSignal?: string | number;
  className?: string;
  children?: React.ReactNode;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const clampPercent = (value: number) => {
  if (Number.isNaN(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 100) {
    return 100;
  }

  return value;
};

function ProgressRing({
  percent,
  color,
  size,
  strokeWidth,
  trackColor,
  animate = true,
  durationMs = 550,
  animationSignal,
  className,
  children,
}: ProgressRingProps) {
  const defaultTrackColor = useThemeColorToken("role.border.default");
  const resolvedTrackColor = trackColor ?? defaultTrackColor;
  const safePercent = clampPercent(percent);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedPercent = useSharedValue(0);
  const hasAnimatedRef = useRef(false);
  const previousSignalRef = useRef<string | number | undefined>(animationSignal);

  useEffect(() => {
    if (!animate) {
      animatedPercent.value = safePercent;
      return;
    }

    if (animationSignal !== undefined) {
      const hasSignalChanged = previousSignalRef.current !== animationSignal;
      const shouldAnimate = !hasAnimatedRef.current || hasSignalChanged;

      if (!shouldAnimate) {
        animatedPercent.value = safePercent;
        return;
      }

      previousSignalRef.current = animationSignal;
      hasAnimatedRef.current = true;
    }

    animatedPercent.value = 0;
    animatedPercent.value = withTiming(safePercent, {
      duration: durationMs,
      easing: Easing.out(Easing.cubic),
    });
  }, [animate, animatedPercent, animationSignal, durationMs, safePercent]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedPercent.value / 100),
  }));

  return (
    <View className={`items-center justify-center ${className ?? ""}`}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={resolvedTrackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {children && <View className="absolute inset-0 items-center justify-center">{children}</View>}
    </View>
  );
}

export default ProgressRing;
