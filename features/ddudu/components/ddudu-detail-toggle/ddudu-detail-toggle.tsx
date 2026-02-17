import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

import { SpoqaText } from "@/components";
import { ChevronRightIcon } from "@/icons";

export interface DDuDuDetailToggleProps {
  isOpen: boolean;
  onPress: () => void;
}

function DDuDuDetailToggle({ isOpen, onPress }: DDuDuDetailToggleProps) {
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isOpen ? "90deg" : "0deg", { duration: 220 }) }],
  }));

  return (
    <Pressable
      className="flex-row items-center justify-between rounded-radius15 bg-white_100 px-[1.2rem] py-[1.4rem]"
      onPress={onPress}
    >
      <SpoqaText className="text-size14 text-black">상세 설정하기</SpoqaText>
      <Animated.View style={iconStyle}>
        <ChevronRightIcon
          size={14}
          fill="#505050"
        />
      </Animated.View>
    </Pressable>
  );
}

export default DDuDuDetailToggle;
