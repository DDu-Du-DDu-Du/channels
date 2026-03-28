import React from "react";
import { View } from "react-native";

import { ArrowLeftIcon } from "@/icons";

import HeaderButton from "./components/header-button/header-button";
import HeaderLabel from "./components/header-label/header-label";

export interface HeaderProps {
  headerLabel: string;
  onPressLeft?: () => void;
  rightButtonIcon?: React.ReactNode;
  onPressRight?: () => void;
  onPressLabel?: () => void;
}

function Header({
  headerLabel,
  onPressLeft,
  rightButtonIcon,
  onPressRight,
  onPressLabel,
}: HeaderProps) {
  return (
    <View
      className="absolute top-0 h-[5.2rem] w-full max-w-[60rem] items-center justify-center z-header bg-role-surface-canvas dark:bg-role-dark-surface-canvas"
      style={{ pointerEvents: "box-none" }}
    >
      <HeaderButton
        buttonPosition="LEFT"
        buttonFn={onPressLeft}
      >
        <ArrowLeftIcon
          size={16}
          stroke="black"
        />
      </HeaderButton>

      <HeaderLabel
        label={headerLabel}
        onPressLabel={onPressLabel}
      />

      <HeaderButton
        buttonPosition="RIGHT"
        buttonFn={onPressRight}
      >
        {rightButtonIcon}
      </HeaderButton>
    </View>
  );
}

export default Header;
