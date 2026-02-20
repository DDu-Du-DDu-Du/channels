import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { SpoqaText } from "@/components";

interface ProgressRingCardProps {
  title: string;
  percent: number;
  fractionText: string;
  color: string;
  size?: number;
  strokeWidth?: number;
  sizeVariant?: "large" | "medium";
  containerClassName?: string;
  denominator?: number;
  animate?: boolean;
  durationMs?: number;
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

function ProgressRingCard({
  title,
  percent,
  fractionText,
  color,
  size = 138,
  strokeWidth = 10,
  sizeVariant = "medium",
  containerClassName,
  denominator,
  animate = true,
  durationMs = 550,
}: ProgressRingCardProps) {
  const safePercent = clampPercent(percent);
  const isZeroDenominator = typeof denominator === "number" && denominator === 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedPercent = useSharedValue(0);
  const targetPercent = isZeroDenominator ? 0 : safePercent;

  useEffect(() => {
    if (!animate) {
      animatedPercent.value = targetPercent;
      return;
    }

    animatedPercent.value = 0;
    animatedPercent.value = withTiming(targetPercent, {
      duration: durationMs,
      easing: Easing.out(Easing.cubic),
    });
  }, [animate, animatedPercent, durationMs, targetPercent]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedPercent.value / 100),
  }));

  const percentTextClass = sizeVariant === "large" ? "text-size20" : "text-size18";
  const fractionTextClass = sizeVariant === "large" ? "text-size13" : "text-size12";
  const titleClass = sizeVariant === "large" ? "text-size14" : "text-size13";

  return (
    <View
      className={`items-center rounded-radius10 bg-sub_1 px-[1.2rem] py-[1.2rem] ${containerClassName ?? ""}`}
    >
      <View className="mb-[0.6rem] rounded-circle bg-example_gray_100 px-[1.2rem] py-[0.4rem]">
        <SpoqaText
          weight="semiBold"
          className={`${titleClass} text-black_500`}
        >
          {title}
        </SpoqaText>
      </View>

      <View className="items-center justify-center">
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#D0D0D0"
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

        <View className="absolute items-center justify-center">
          <SpoqaText
            weight="bold"
            className={`${percentTextClass} text-black_500`}
          >
            {isZeroDenominator ? "-" : `${Math.round(safePercent)}%`}
          </SpoqaText>
          <SpoqaText className={`${fractionTextClass} text-example_gray_800`}>
            {fractionText}
          </SpoqaText>
        </View>
      </View>
    </View>
  );
}

export default ProgressRingCard;
