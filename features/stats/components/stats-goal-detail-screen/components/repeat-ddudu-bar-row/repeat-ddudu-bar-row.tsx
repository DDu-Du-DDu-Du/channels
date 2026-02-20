import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { SpoqaText } from "@/components";
import { StatsDetailRepeatDduduItemType } from "@/types/response/stats/stats";

interface RepeatDduduBarRowProps {
  item: StatsDetailRepeatDduduItemType;
  widthPercent: number;
  opacity: number;
  goalColor: string;
  onPress?: (item: StatsDetailRepeatDduduItemType) => void;
}

function RepeatDduduBarRow({
  item,
  widthPercent,
  opacity,
  goalColor,
  onPress,
}: RepeatDduduBarRowProps) {
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
            className="px-[1.2rem] text-size14 text-black_500"
            numberOfLines={1}
          >
            {item.repeatDduduName}
          </SpoqaText>
        </Animated.View>
      </View>
      <View className="w-[12%] min-w-[3.8rem] shrink-0">
        <SpoqaText className="text-right text-size13 text-example_gray_1000">
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

export type { RepeatDduduBarRowProps };
export default RepeatDduduBarRow;
