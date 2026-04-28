import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import SpoqaText from "@/components/spoqa-text/spoqa-text";

function LoginTitle() {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(20, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      true,
    );
  }, [translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View>
        <SpoqaText
          weight="semiBold"
          className="text-[3rem] leading-[3rem]"
        >
          {"{타이틀}"}
        </SpoqaText>
        <SpoqaText className="text-[1.6rem]">뭐라고 쓸지 고민중..</SpoqaText>
      </View>
    </Animated.View>
  );
}

export default LoginTitle;
