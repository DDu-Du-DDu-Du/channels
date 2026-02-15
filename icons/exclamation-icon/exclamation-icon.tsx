import React from "react";
import Svg, { Line, Path } from "react-native-svg";

export interface IconProps {
  size?: number;
  stroke?: string;
  className?: string;
}

function ExclamationIcon({ size = 24, stroke = "#020202", className }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Line
        x1="12"
        y1="5.3"
        x2="12"
        y2="11.98"
        stroke={stroke}
        strokeMiterlimit={10}
        strokeWidth={1.91}
      />
      <Path
        d="M1.5 5.3V14.84A3.82 3.82 0 0 0 5.32 18.66H7.23V21.52L13 18.66H18.73A3.82 3.82 0 0 0 22.55 14.84V5.3A3.82 3.82 0 0 0 18.73 1.48H5.32A3.82 3.82 0 0 0 1.5 5.3Z"
        fill="none"
        stroke={stroke}
        strokeMiterlimit={10}
        strokeWidth={1.91}
      />
      <Line
        x1="11.05"
        y1="13.89"
        x2="12.95"
        y2="13.89"
        stroke={stroke}
        strokeMiterlimit={10}
        strokeWidth={1.91}
      />
    </Svg>
  );
}

export default ExclamationIcon;
