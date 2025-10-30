import { ComplexAnimationBuilder, StyleProps } from "react-native-reanimated";

function useAnimationSafeChain<T extends typeof ComplexAnimationBuilder>(
  animation: T,
  options?: {
    duration?: number | null;
    easing?: ((v: number) => number) | null;
    initialValues?: StyleProps;
  },
): InstanceType<T> {
  let builder = animation.createInstance();

  if (options?.duration) {
    builder = builder.duration(options.duration) as InstanceType<T>;
  }

  if (options?.easing) {
    builder = builder.easing(options.easing) as InstanceType<T>;
  }

  if (options?.initialValues) {
    builder = builder.withInitialValues(options.initialValues) as InstanceType<T>;
  }

  return builder as InstanceType<T>;
}

export default useAnimationSafeChain;
