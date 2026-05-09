import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import Animated, { type SharedValue, interpolate, useAnimatedStyle } from "react-native-reanimated";

import { useThemeColorToken } from "@/hooks/use-theme-color";
import { SearchIcon } from "@/icons";
import { hexConvertForRGBA } from "@/utils";

export interface TodosearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  progress: SharedValue<number>;
}

function TodosearchBar({ value, onChangeText, progress }: TodosearchBarProps) {
  const { t } = useTranslation();
  const [containerWidth, setContainerWidth] = useState(0);
  const iconColor = useThemeColorToken("role.icon.inverse");
  const placeholderColor = useThemeColorToken("ui.input.default.placeholder");
  const inputColor = useThemeColorToken("ui.input.default.text");
  const translucentBorderColor = useMemo(
    () => hexConvertForRGBA({ hex: iconColor, alpha: 0.25 }),
    [iconColor],
  );
  const translucentBackgroundColor = useMemo(
    () => hexConvertForRGBA({ hex: iconColor, alpha: 0.24 }),
    [iconColor],
  );

  const animatedSearchBarStyle = useAnimatedStyle(() => {
    const collapsedWidth = 56;
    const expandedWidth = containerWidth > collapsedWidth ? containerWidth : collapsedWidth;

    return {
      width: interpolate(progress.value, [0, 1], [collapsedWidth, expandedWidth]),
    };
  }, [containerWidth]);

  const animatedInputStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return (
    <View
      className="w-full items-center px-4 pb-[0.8rem]"
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width - 32)}
    >
      <Animated.View
        style={[
          animatedSearchBarStyle,
          styles.searchBarContainer,
          {
            borderColor: translucentBorderColor,
            backgroundColor: translucentBackgroundColor,
          },
        ]}
      >
        <View className="h-full flex-row items-center">
          <Animated.View style={[{ flex: 1 }, animatedInputStyle]}>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder={t("todo.searchPlaceholder")}
              placeholderTextColor={placeholderColor}
              className="h-full text-size15"
              style={{ color: inputColor }}
              autoFocus
              returnKeyType="search"
            />
          </Animated.View>
          <SearchIcon
            size={20}
            stroke={iconColor}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    height: 42,
    overflow: "hidden",
    borderRadius: 999,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 14,
  },
});

export default TodosearchBar;
