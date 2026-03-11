import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { SpoqaText } from "@/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";

export interface StatsGoalChartItem {
  goalId: number;
  goalName: string;
  value: number;
  color?: string;
}

interface StatsGoalChartCardProps {
  title: string;
  unit: string;
  items: StatsGoalChartItem[];
}

const formatNumber = (value: number) => {
  if (Number.isInteger(value)) {
    return `${value}`;
  }

  return value.toFixed(1);
};

interface AnimatedBarProps {
  targetHeight: number;
  color: string;
  progress: SharedValue<number>;
}

function AnimatedBar({ targetHeight, color, progress }: AnimatedBarProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    height: targetHeight * progress.value,
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        { backgroundColor: color, minHeight: targetHeight > 0 ? 12 : 0 },
        animatedStyle,
      ]}
    />
  );
}

function StatsGoalChartCard({ title, unit, items }: StatsGoalChartCardProps) {
  const fallbackItemColor = useThemeColorToken("role.text.tertiary");
  const sortedItems = [...items].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...sortedItems.map((item) => item.value), 0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 550,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, items]);

  return (
    <View className="mb-[3.2rem]">
      <SpoqaText
        weight="semiBold"
        className="mb-[1.3rem] text-size18 text-role-text-inverse dark:text-role-dark-text-inverse"
      >
        {title}
      </SpoqaText>

      <View className="rounded-radius15 bg-role-surface-subtle dark:bg-role-dark-surface-subtle px-[1.2rem] py-[1.2rem]">
        {sortedItems.length === 0 ? (
          <View className="h-[14rem] items-center justify-center">
            <SpoqaText className="text-size14 text-role-text-tertiary dark:text-role-dark-text-tertiary">
              데이터가 없어요.
            </SpoqaText>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ columnGap: 18, paddingRight: 14 }}
          >
            {sortedItems.map((item, index) => {
              const ratio = maxValue > 0 ? item.value / maxValue : 0;
              const targetHeight = Math.max(12, Math.round(120 * ratio));
              const itemColor = item.color ?? fallbackItemColor;

              return (
                <View
                  key={`${title}-${item.goalId}`}
                  className="w-[8.8rem]"
                >
                  <View className="mb-[0.8rem] h-[2.2rem] items-center justify-end">
                    <SpoqaText
                      className={`text-size13 ${index === 0 ? "text-role-text-primary dark:text-role-dark-text-primary" : "text-role-text-tertiary dark:text-role-dark-text-tertiary"}`}
                    >
                      {`${formatNumber(item.value)}${unit}`}
                    </SpoqaText>
                  </View>

                  <View className="h-[12rem] items-center justify-end">
                    <AnimatedBar
                      targetHeight={targetHeight}
                      color={itemColor}
                      progress={progress}
                    />
                  </View>

                  <View className="mt-[0.9rem] border-t border-role-border-default dark:border-role-dark-border-default pt-[1rem]">
                    <View
                      className={`rounded-radius10 px-[0.8rem] py-[0.7rem] ${index === 0 ? "bg-role-surface-panel dark:bg-role-dark-surface-panel" : "bg-role-surface-subtle dark:bg-role-dark-surface-subtle"}`}
                    >
                      <SpoqaText
                        className="text-center text-size13 leading-[1.6rem]"
                        style={{ color: itemColor }}
                      >
                        {item.goalName}
                      </SpoqaText>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: 34,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default StatsGoalChartCard;
