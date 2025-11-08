import React from "react";
import { Pressable } from "react-native";

export interface HeaderButtonProps {
  buttonFn?: () => void;
  children?: React.ReactNode;
  buttonPosition: "LEFT" | "RIGHT";
}

function HeaderButton({ buttonFn, buttonPosition, children }: HeaderButtonProps) {
  if (!buttonFn) {
    return <></>;
  }

  const positionClass =
    buttonPosition === "LEFT" ? "left-[2.4rem] top-[1.9rem]" : "right-[2.4rem] top-[1.9rem]";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={buttonFn}
      className={`absolute h-[1.6rem] w-[1.6rem] items-center justify-center ${positionClass}`}
    >
      {children}
    </Pressable>
  );
}

export default HeaderButton;
