import React from "react";
import { AnimatableNumericValue, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  ComplexAnimationBuilder,
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useAnimationSafeChain } from "./hooks";

type MotionDimension = Partial<{
  x: AnimatableNumericValue | `${number}%`;
  y: AnimatableNumericValue | `${number}%`;
  opacity: number;
}>;

type MotionStyle = Partial<{
  dimension: MotionDimension;
  type: typeof ComplexAnimationBuilder;
}>;

export interface MotionViewProps {
  className?: string;
  initial?: Partial<MotionStyle>;
  animate?: Partial<MotionStyle>;
  exit?: Partial<MotionStyle>;
  whileTap?: { scale: number };
  durationIn?: number | null;
  durationOut?: number | null;
  easingIn?: ((v: number) => number) | null;
  easingOut?: ((v: number) => number) | null;
  children: React.ReactNode;
}

function MotionView({
  className,
  initial,
  animate,
  exit,
  whileTap,
  durationIn,
  durationOut,
  easingIn,
  easingOut,
  children,
}: MotionViewProps) {
  const pressed = useSharedValue<boolean>(false);
  const tap = Gesture.Tap()
    .maxDuration(10_000)
    .onBegin(() => {
      pressed.value = true;
    })
    .onFinalize(() => {
      pressed.value = false;
    });
  const tapAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(whileTap && pressed.value ? whileTap.scale : 1) }],
  }));

  // TODO: translate 잘못 적용되는 버그 수정 필요
  const entering = useAnimationSafeChain(initial?.type ?? FadeInUp, {
    duration: durationIn,
    easing: easingIn,
    ...(initial?.dimension
      ? {
          initialValues: {
            opacity: initial.dimension.opacity ?? 0,
            transform: [
              { translateX: initial.dimension.x ?? 0 },
              { translateY: initial.dimension.y ?? "-100%" },
            ],
          },
        }
      : null),
  });

  const exiting = useAnimationSafeChain(exit?.type ?? FadeOutUp, {
    duration: durationOut,
    easing: easingOut,
    ...(animate?.dimension
      ? {
          initialValues: {
            opacity: animate.dimension.opacity ?? 1,
            transform: [
              { translateX: animate.dimension.x ?? 0 },
              { translateY: animate.dimension.y ?? 0 },
            ],
          },
        }
      : null),
  });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        entering={entering}
        exiting={exiting}
      >
        <Animated.View style={[tapAnimated]}>
          <View className={className}>{children}</View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

export default MotionView;
