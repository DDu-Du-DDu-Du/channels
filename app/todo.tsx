import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { PageHeader } from "@/components";
import { TodoSearchScreen } from "@/features/todo-search";

function Todo() {
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withDelay(
      260,
      withTiming(1, {
        duration: 220,
      }),
    );
  }, [headerOpacity]);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <Animated.View style={animatedHeaderStyle}>
        <PageHeader
          title="투두 검색"
          titleClassName="text-size17"
        />
      </Animated.View>
      <TodoSearchScreen />
    </View>
  );
}

export default Todo;
