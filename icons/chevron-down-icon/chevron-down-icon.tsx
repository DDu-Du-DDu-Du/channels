import React from "react";
import Svg, { Path } from "react-native-svg";

import { useResolvedIconColor } from "@/icons/use-resolved-icon-color";

export interface IconProps {
  size?: number;
  fill?: string;
  className?: string;
}

function ChevronDownIcon({ size = 32, fill, className }: IconProps) {
  const resolvedFill = useResolvedIconColor(fill, "default");

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 512 320"
      fill={resolvedFill}
      className={className}
    >
      <Path d="M278.6 310.6c-12.5 12.5-32.8 12.5-45.3 0l-192-192c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L256 242.7 425.4 73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-192 192z" />
    </Svg>
  );
}

export default ChevronDownIcon;
