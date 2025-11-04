import React from "react";
import Svg, { Path } from "react-native-svg";

export interface IconProps {
  size?: number;
  fill?: string;
  className?: string;
}

function CheckIcon({ size = 32, fill = "black", className }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 960 960"
      fill={fill}
      className={className}
    >
      <Path d="M382-208 122-468l90-90 170 170 366-366 90 90-456 456Z" />
    </Svg>
  );
}

export default CheckIcon;
