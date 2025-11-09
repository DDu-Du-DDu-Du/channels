import Svg, { Path } from "react-native-svg";

export interface IconProps {
  size?: number;
  fill?: string;
  className?: string;
}

function CloseIcon({ size = 32, fill = "black", className }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill={fill}
      className={className}
    >
      <Path d="m249-183-66-66 231-231-231-231 66-66 231 231 231-231 66 66-231 231 231 231-66 66-231-231-231 231Z" />
    </Svg>
  );
}

export default CloseIcon;
