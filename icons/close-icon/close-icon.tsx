import Svg, { Path } from "react-native-svg";

export interface IconProps {
  size?: number;
  fill?: string;
  stroke?: string;
  className?: string;
}

function CloseIcon({ size = 32, fill = "black", stroke, className }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      className={className}
    >
      <Path
        d="m249-183-66-66 231-231-231-231 66-66 231 231 231-231 66 66-231 231 231 231-66 66-231-231-231 231Z"
        fill={fill}
        stroke={stroke}
      />
    </Svg>
  );
}

export default CloseIcon;
