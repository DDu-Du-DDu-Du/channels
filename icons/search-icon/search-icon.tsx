import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

export interface IconProps {
  size?: number;
  stroke?: string;
  className?: string;
}

function SearchIcon({ size = 24, stroke = "#292D32", className }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Circle
        cx={11}
        cy={11}
        r={6}
        stroke={stroke}
        strokeWidth={1.8}
      />
      <Path
        d="M15.5 15.5L20 20"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default SearchIcon;
