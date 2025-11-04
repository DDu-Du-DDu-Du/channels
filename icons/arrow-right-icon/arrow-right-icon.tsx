import React from "react";
import Svg, { Path } from "react-native-svg";

export interface IconProps {
  size?: number;
  stroke?: string;
  className?: string;
}

function ArrowRightIcon({ size = 32, stroke = "black", className }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 12 18"
      fill="none"
      className={className}
    >
      <Path
        d="M1 17L11 9L1 1"
        stroke={stroke}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

export default ArrowRightIcon;
