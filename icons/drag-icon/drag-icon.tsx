import React from "react";
import Svg, { Circle } from "react-native-svg";

export interface IconProps {
  size?: number;
  fill?: string;
  className?: string;
}

function DragIcon({ size = 12, fill = "#D9D9D9", className }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill={fill}
      className={className}
    >
      <Circle
        cx="2"
        cy="2"
        r="2"
        fill={fill}
      />
      <Circle
        cx="2"
        cy="10"
        r="2"
        fill={fill}
      />
      <Circle
        cx="10"
        cy="2"
        r="2"
        fill={fill}
      />
      <Circle
        cx="10"
        cy="10"
        r="2"
        fill={fill}
      />
    </Svg>
  );
}

export default DragIcon;
