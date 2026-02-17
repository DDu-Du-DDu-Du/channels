import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { SpoqaText } from "@/components";
import { CheckIcon, OptionIcon } from "@/icons";
import { hexConvertForRGBA } from "@/utils";

export interface MainDDuDuItemProps {
  id: number;
  ddudu: string;
  status: "UNCOMPLETED" | "COMPLETE";
  color: string;
  onDDuDuCompleteToggle: (id: number) => void;
  onTextPress?: (id: number) => void;
  handleToggleOn: () => void;
}

function MainDDuDuItem({
  id,
  ddudu,
  status,
  color,
  onDDuDuCompleteToggle,
  onTextPress,
  handleToggleOn,
}: MainDDuDuItemProps) {
  const isComplete = status === "COMPLETE";

  const handleEditMode = () => {
    onTextPress?.(id);
  };

  const checkRotate = useSharedValue(0);

  useEffect(() => {
    checkRotate.value = 0;
  }, [checkRotate, isComplete]);

  const checkboxIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${checkRotate.value}deg` }],
  }));

  const handlePressComplete = () => {
    onDDuDuCompleteToggle(id);
    checkRotate.value = withSequence(
      withTiming(-8, { duration: 140, easing: Easing.out(Easing.quad) }),
      withTiming(8, { duration: 160, easing: Easing.out(Easing.quad) }),
      withTiming(-5, { duration: 130, easing: Easing.out(Easing.quad) }),
      withTiming(5, { duration: 120, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 150, easing: Easing.out(Easing.quad) }),
    );
  };

  const leftBackgroundColor = hexConvertForRGBA({ hex: color, alpha: 0.12 });
  const rightBackgroundColor = hexConvertForRGBA({ hex: color, alpha: 0.2 });

  return (
    <View className="w-full flex-row overflow-hidden">
      <Pressable
        className="w-[80%] flex-row items-center"
        style={{ backgroundColor: leftBackgroundColor }}
        onPress={handleEditMode}
      >
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isComplete }}
          className="w-[25%] items-center justify-center py-[0.9rem]"
          onPress={handlePressComplete}
        >
          <Animated.View style={checkboxIconStyle}>
            <CheckIcon
              size={24}
              fill={isComplete ? `#${color}` : "#D9D9D9"}
            />
          </Animated.View>
        </Pressable>
        <View className="w-[75%] py-[0.9rem] pl-[0.6rem] pr-[1.1rem]">
          <SpoqaText
            weight="regular"
            className="text-size14 text-black"
            numberOfLines={1}
          >
            {ddudu}
          </SpoqaText>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="h-full w-[20%] items-center justify-center"
        style={{ backgroundColor: rightBackgroundColor }}
        onPress={handleToggleOn}
      >
        <OptionIcon fill={`#${color}`} />
      </Pressable>
    </View>
  );
}

export default MainDDuDuItem;
