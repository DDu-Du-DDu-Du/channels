import React from "react";
import Svg, { Circle } from "react-native-svg";

import { useResolvedIconColor } from "@/icons/use-resolved-icon-color";

export interface IconProps {
  size?: number;
  fill?: string;
  className?: string;
}

function DragIcon({ size = 12, fill, className }: IconProps) {
  const resolvedFill = useResolvedIconColor(fill, "muted");
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill={resolvedFill}
      className={className}
    >
      <Circle
        cx="2"
        cy="2"
        r="2"
        fill={resolvedFill}
      />
      <Circle
        cx="2"
        cy="10"
        r="2"
        fill={resolvedFill}
      />
      <Circle
        cx="10"
        cy="2"
        r="2"
        fill={resolvedFill}
      />
      <Circle
        cx="10"
        cy="10"
        r="2"
        fill={resolvedFill}
      />
    </Svg>
  );
}

export default DragIcon;
