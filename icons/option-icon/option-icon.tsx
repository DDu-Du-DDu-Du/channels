import React from "react";
import Svg, { Path } from "react-native-svg";

export interface IconProps {
  fill?: string;
  className?: string;
}

function OptionIcon({ fill = "#D9D9D9", className }: IconProps) {
  return (
    <Svg
      width={13}
      height={4}
      viewBox="0 0 13 4"
      fill="none"
      className={className}
    >
      <Path
        d="M6.4998 0.5C5.50569 0.5 4.6998 1.17157 4.6998 2C4.6998 2.82843 5.50569 3.5 6.4998 3.5C7.49392 3.5 8.2998 2.82843 8.2998 2C8.2998 1.17157 7.49392 0.5 6.4998 0.5Z"
        fill={fill}
      />
      <Path
        d="M2.29961 0.5C1.3055 0.5 0.49961 1.17157 0.49961 2C0.49961 2.82843 1.3055 3.5 2.29961 3.5C3.29372 3.5 4.09961 2.82843 4.09961 2C4.09961 1.17157 3.29372 0.5 2.29961 0.5Z"
        fill={fill}
      />
      <Path
        d="M10.7 0.5C9.70589 0.5 8.9 1.17157 8.9 2C8.9 2.82843 9.70589 3.5 10.7 3.5C11.6941 3.5 12.5 2.82843 12.5 2C12.5 1.17157 11.6941 0.5 10.7 0.5Z"
        fill={fill}
      />
    </Svg>
  );
}

export default OptionIcon;
