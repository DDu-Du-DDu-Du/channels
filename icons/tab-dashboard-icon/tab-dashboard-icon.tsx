import React from "react";
import Svg, { Line, Rect } from "react-native-svg";

import { useResolvedIconColor } from "@/icons/use-resolved-icon-color";

export interface IconProps {
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
}

function TabDashboardIcon({ size = 20, stroke, strokeWidth = 2, className }: IconProps) {
  const resolvedStroke = useResolvedIconColor(stroke, "default");

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Rect
        x={4}
        y={4}
        width={16}
        height={16}
        rx={2}
        stroke={resolvedStroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Line
        x1={4}
        y1={9}
        x2={20}
        y2={9}
        stroke={resolvedStroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Line
        x1={9}
        y1={10}
        x2={9}
        y2={20}
        stroke={resolvedStroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default TabDashboardIcon;
