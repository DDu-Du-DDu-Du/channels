import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

import { SpoqaText } from "@/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ChevronRightIcon } from "@/icons";

export interface DDuDuDetailToggleProps {
  isOpen: boolean;
  onPress: () => void;
}

function DDuDuDetailToggle({ isOpen, onPress }: DDuDuDetailToggleProps) {
  const iconColor = useThemeColorToken("role.icon.default");
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isOpen ? "90deg" : "0deg", { duration: 220 }) }],
  }));

  return (
    <Pressable
      className="flex-row items-center justify-between rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.2rem] py-[1.4rem]"
      onPress={onPress}
    >
      <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
        상세 설정하기
      </SpoqaText>
      <Animated.View style={iconStyle}>
        <ChevronRightIcon
          size={14}
          fill={iconColor}
        />
      </Animated.View>
    </Pressable>
  );
}

export default DDuDuDetailToggle;
