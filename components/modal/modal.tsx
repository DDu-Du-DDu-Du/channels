import React from "react";
import { DimensionValue, Modal as RNModal, View } from "react-native";
import { ComplexAnimationBuilder, FadeInDown, FadeOutDown } from "react-native-reanimated";

import { MotionView } from "@/components/motion";

export interface BaseModalProps {
  children: React.ReactNode;
  isToggle: boolean;
  width?: DimensionValue;
  height?: DimensionValue;
  backgroundColor?: string;
  entering?: typeof ComplexAnimationBuilder;
  exiting?: typeof ComplexAnimationBuilder;
  className?: string;
}

function Modal({
  children,
  isToggle = false,
  width = 300,
  height,
  backgroundColor = "white",
  entering = FadeInDown,
  exiting = FadeOutDown,
  className,
}: BaseModalProps) {
  return (
    <RNModal
      visible={isToggle}
      transparent
      statusBarTranslucent
    >
      <View className="flex-1 items-center justify-center">
        <MotionView
          initial={{ type: entering }}
          exit={{ type: exiting }}
          className={`rounded-radius10 shadow-shadow_100 text-center ${className ?? ""}`}
          style={{ width, height, backgroundColor }}
        >
          {children}
        </MotionView>
      </View>
    </RNModal>
  );
}

export default Modal;
