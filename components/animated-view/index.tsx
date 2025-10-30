import { ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

function AnimatedView({ className, ...animatedProps }: AnimatedProps<ViewProps>) {
  return (
    <Animated.View
      className={className}
      {...animatedProps}
    />
  );
}

export default AnimatedView;
