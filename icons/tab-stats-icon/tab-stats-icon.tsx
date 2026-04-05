import React from "react";
import Svg, { Path } from "react-native-svg";

import { useResolvedIconColor } from "@/icons/use-resolved-icon-color";

export interface IconProps {
  size?: number;
  fill?: string;
  className?: string;
}

function TabStatsIcon({ size = 18, fill, className }: IconProps) {
  const resolvedFill = useResolvedIconColor(fill, "default");

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 17 17"
      fill={resolvedFill}
      className={className}
    >
      <Path
        d="M17 16v1h-17v-1h17zM5.203 7.976l4.204 3.026 5.593-6.251v2.284h1v-4.035h-4.036v1h2.366l-5.070 5.665-4.129-2.974-4.372 3.956 0.671 0.741 3.773-3.412z"
        fill={resolvedFill}
      />
    </Svg>
  );
}

export default TabStatsIcon;
