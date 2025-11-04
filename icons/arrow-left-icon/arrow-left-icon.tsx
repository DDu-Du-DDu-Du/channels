import React from "react";
import Svg, { Path } from "react-native-svg";

export interface IconProps {
  size?: number;
  stroke?: string;
  className?: string;
}

function ArrowLeftIcon({ size = 32, stroke = "black", className }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 12 18"
      fill="none"
      className={className}
    >
      <Path
        d="M12 1L2 9L12 17"
        stroke={stroke}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

export default ArrowLeftIcon;
