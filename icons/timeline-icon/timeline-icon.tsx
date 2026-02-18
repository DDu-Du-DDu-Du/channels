import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

export interface IconProps {
  size?: number;
  stroke?: string;
  fill?: string;
  className?: string;
}

function TimelineIcon({ size = 18, stroke = "#292D32", fill = "none", className }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      className={className}
    >
      <Path
        d="M6 4V20"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Circle
        cx={6}
        cy={6}
        r={1.5}
        fill={stroke}
      />
      <Circle
        cx={6}
        cy={12}
        r={1.5}
        fill={stroke}
      />
      <Circle
        cx={6}
        cy={18}
        r={1.5}
        fill={stroke}
      />
      <Rect
        x={10}
        y={4.5}
        width={10}
        height={3}
        rx={1.2}
        stroke={stroke}
        strokeWidth={1.5}
      />
      <Rect
        x={10}
        y={10.5}
        width={7}
        height={3}
        rx={1.2}
        stroke={stroke}
        strokeWidth={1.5}
      />
      <Rect
        x={10}
        y={16.5}
        width={9}
        height={3}
        rx={1.2}
        stroke={stroke}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

export default TimelineIcon;
