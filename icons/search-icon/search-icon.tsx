import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

import { useResolvedIconColor } from "@/icons/use-resolved-icon-color";

export interface IconProps {
  size?: number;
  stroke?: string;
  className?: string;
}

function SearchIcon({ size = 24, stroke, className }: IconProps) {
  const resolvedStroke = useResolvedIconColor(stroke, "default");

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
        stroke={resolvedStroke}
        strokeWidth={1.8}
      />
      <Path
        d="M15.5 15.5L20 20"
        stroke={resolvedStroke}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default SearchIcon;
