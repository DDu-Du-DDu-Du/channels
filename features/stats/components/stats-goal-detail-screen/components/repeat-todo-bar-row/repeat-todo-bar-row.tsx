import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { SpoqaText } from "@/components";
import { StatsDetailRepeatTodoItemType } from "@/types/response/stats/stats";

interface RepeatTodoBarRowProps {
  item: StatsDetailRepeatTodoItemType;
  widthPercent: number;
  opacity: number;
  goalColor: string;
  onPress?: (item: StatsDetailRepeatTodoItemType) => void;
}

function RepeatTodoBarRow({
  item,
  widthPercent,
  opacity,
  goalColor,
  onPress,
}: RepeatTodoBarRowProps) {
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = 0;
    animatedWidth.value = withTiming(widthPercent, {
      duration: 450,
      easing: Easing.out(Easing.cubic),
    });
  }, [animatedWidth, widthPercent]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  const handlePress = () => {
    onPress?.(item);
  };

  return (
    <Pressable
      className="flex-row items-center justify-between"
      onPress={handlePress}
    >
      <View className="w-[88%] pr-[0.6rem]">
        <Animated.View
          style={[
            styles.bar,
            animatedStyle,
            {
              backgroundColor: goalColor,
              opacity,
            },
          ]}
        >
          <SpoqaText
            className="px-[1.2rem] text-size14 text-role-text-primary dark:text-role-dark-text-primary"
            numberOfLines={1}
          >
            {item.repeatTodoName}
          </SpoqaText>
        </Animated.View>
      </View>
      <View className="w-[12%] min-w-[3.8rem] shrink-0">
        <SpoqaText className="text-right text-size13 text-role-text-tertiary dark:text-role-dark-text-tertiary">
          {`${item.completedCount}회`}
        </SpoqaText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 32,
    borderRadius: 999,
    justifyContent: "center",
  },
});

export type { RepeatTodoBarRowProps };
export default RepeatTodoBarRow;
