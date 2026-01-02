import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { SpoqaText } from "@/components";
import { remToPx } from "@/utils";

import { useFeedTypeSwitchToggle } from "./hooks";

export interface FeedTypeSwitchProps {
  firstLabel?: string;
  secondLabel?: string;
  selectedOption?: string;
  alternativeOption?: string;
  className?: string;
}

function FeedTypeSwitch({
  firstLabel = "뚜두",
  secondLabel = "스케줄",
  selectedOption = "ddudu",
  alternativeOption = "schedule",
  className,
}: FeedTypeSwitchProps) {
  const { toggle, handleToggleToFirst, handleToggleToSecond } = useFeedTypeSwitchToggle({
    selectedOption,
    alternativeOption,
  });

  const [containerWidth, setContainerWidth] = useState(0);
  const x = useSharedValue(0);

  const toX = useMemo(() => (containerWidth > 0 ? containerWidth / 2 : 0), [containerWidth]);

  const animate = useCallback(
    (target: string) => {
      const isFirst = target === selectedOption;
      x.value = withTiming(isFirst ? 0 : toX, { duration: 200 });
    },
    [selectedOption, toX, x],
  );

  React.useEffect(() => {
    animate(toggle);
  }, [toggle, animate]);

  const onLayoutContainer = useCallback(
    (e: any) => {
      const width = e?.nativeEvent?.layout?.width ?? 0;
      if (width !== containerWidth) {
        setContainerWidth(width);
      }
    },
    [containerWidth],
  );

  const isFirstSelected = toggle === selectedOption;

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return (
    <View
      onLayout={onLayoutContainer}
      className={`relative flex flex-row w-[16rem] h-[3rem] bg-white_100 rounded-[5rem] shadow-shadow_100 overflow-hidden ${className ?? ""}`}
    >
      <Animated.View style={[pillStyle, styles.pill]} />
      <Pressable
        className="flex-1 items-center justify-center z-10"
        onPress={handleToggleToFirst}
      >
        <SpoqaText className={`text-size13 ${isFirstSelected ? "text-white_100 font-medium" : ""}`}>
          {firstLabel}
        </SpoqaText>
      </Pressable>
      <Pressable
        className="flex-1 items-center justify-center z-10"
        onPress={handleToggleToSecond}
      >
        <SpoqaText
          className={`text-size13 ${!isFirstSelected ? "text-white_100 font-medium" : ""}`}
        >
          {secondLabel}
        </SpoqaText>
      </Pressable>
    </View>
  );
}

export default FeedTypeSwitch;

const styles = StyleSheet.create({
  pill: {
    position: "absolute",
    width: "50%",
    height: "100%",
    backgroundColor: "#1363DE",
    borderWidth: 2,
    borderColor: "#F5F5F5",
    borderRadius: remToPx("1.5rem"),
  },
});
