import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { useThemeColorToken } from "@/hooks/use-theme-color";
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
  firstLabel,
  secondLabel,
  selectedOption = "Todo",
  alternativeOption = "schedule",
  className,
}: FeedTypeSwitchProps) {
  const { t } = useTranslation();
  const pillBackgroundColor = useThemeColorToken("ui.button.primary.bg");
  const pillBorderColor = useThemeColorToken("role.surface.canvas");
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
      className={`relative flex flex-row w-[16rem] h-[3rem] bg-role-surface-canvas dark:bg-role-dark-surface-canvas rounded-[5rem] shadow-shadow_100 overflow-hidden ${className ?? ""}`}
    >
      <Animated.View
        style={[
          pillStyle,
          styles.pill,
          {
            backgroundColor: pillBackgroundColor,
            borderColor: pillBorderColor,
          },
        ]}
      />
      <Pressable
        className="flex-1 items-center justify-center z-10"
        onPress={handleToggleToFirst}
      >
        <SpoqaText
          className={`text-size13 ${isFirstSelected ? "text-role-text-inverse dark:text-role-dark-text-inverse font-medium" : ""}`}
        >
          {firstLabel ?? t("feed.todo")}
        </SpoqaText>
      </Pressable>
      <Pressable
        className="flex-1 items-center justify-center z-10"
        onPress={handleToggleToSecond}
      >
        <SpoqaText
          className={`text-size13 ${!isFirstSelected ? "text-role-text-inverse dark:text-role-dark-text-inverse font-medium" : ""}`}
        >
          {secondLabel ?? t("feed.schedule")}
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
    borderWidth: 2,
    borderRadius: remToPx("1.5rem"),
  },
});
