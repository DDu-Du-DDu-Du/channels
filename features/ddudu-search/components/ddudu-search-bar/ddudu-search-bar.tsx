import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Animated, { type SharedValue, interpolate, useAnimatedStyle } from "react-native-reanimated";

import { SearchIcon } from "@/icons";

export interface DDuDuSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  progress: SharedValue<number>;
}

function DDuDuSearchBar({ value, onChangeText, progress }: DDuDuSearchBarProps) {
  const [containerWidth, setContainerWidth] = useState(0);

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
      <Animated.View style={[animatedSearchBarStyle, styles.searchBarContainer]}>
        <View className="h-full flex-row items-center">
          <Animated.View style={[{ flex: 1 }, animatedInputStyle]}>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder="투두를 검색하세요"
              placeholderTextColor="#B5B5BA"
              className="h-full text-size15 text-white"
              autoFocus
              returnKeyType="search"
            />
          </Animated.View>
          <SearchIcon
            size={20}
            stroke="#FFFFFF"
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
    borderColor: "rgba(255, 255, 255, 0.25)",
    backgroundColor: "rgba(255, 255, 255, 0.24)",
    paddingLeft: 16,
    paddingRight: 14,
  },
});

export default DDuDuSearchBar;
