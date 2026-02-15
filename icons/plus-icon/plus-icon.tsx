import React from "react";
import Svg, { Path } from "react-native-svg";

export interface IconProps {
  size?: number;
  stroke?: string;
  className?: string;
  fill?: string;
}

function PlusIcon({ size = 16, stroke = "black", className }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <Path
        d="M8 0V16"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <Path
        d="M16 8H0"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default PlusIcon;
