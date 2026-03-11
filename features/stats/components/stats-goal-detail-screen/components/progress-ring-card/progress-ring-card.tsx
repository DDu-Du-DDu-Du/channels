import { View } from "react-native";

import { ProgressRing, SpoqaText } from "@/components";

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
  const targetPercent = isZeroDenominator ? 0 : safePercent;

  const percentTextClass = sizeVariant === "large" ? "text-size20" : "text-size18";
  const fractionTextClass = sizeVariant === "large" ? "text-size13" : "text-size12";
  const titleClass = sizeVariant === "large" ? "text-size14" : "text-size13";

  return (
    <View
      className={`items-center rounded-radius10 bg-role-surface-panel dark:bg-role-dark-surface-panel px-[1.2rem] py-[1.2rem] ${containerClassName ?? ""}`}
    >
      <View className="mb-[0.6rem] rounded-circle bg-role-surface-panel dark:bg-role-dark-surface-panel px-[1.2rem] py-[0.4rem]">
        <SpoqaText
          weight="semiBold"
          className={`${titleClass} text-role-text-primary dark:text-role-dark-text-primary`}
        >
          {title}
        </SpoqaText>
      </View>

      <View className="items-center justify-center">
        <ProgressRing
          percent={targetPercent}
          color={color}
          size={size}
          strokeWidth={strokeWidth}
          trackColor="#D0D0D0"
          animate={animate}
          durationMs={durationMs}
        >
          <View className="items-center justify-center">
            <SpoqaText
              weight="bold"
              className={`${percentTextClass} text-role-text-primary dark:text-role-dark-text-primary`}
            >
              {isZeroDenominator ? "-" : `${Math.round(safePercent)}%`}
            </SpoqaText>
            <SpoqaText
              className={`${fractionTextClass} text-role-text-tertiary dark:text-role-dark-text-tertiary`}
            >
              {fractionText}
            </SpoqaText>
          </View>
        </ProgressRing>
      </View>
    </View>
  );
}

export default ProgressRingCard;
