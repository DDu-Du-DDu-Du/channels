import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

export interface LineBoxProps {
  color?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  mode?: "absolute" | "inline";
}

function LineBox({ color, className = "", style, mode = "absolute" }: LineBoxProps) {
  const wrapperClassName =
    mode === "inline"
      ? `h-full w-[5rem] items-center justify-center ${className}`
      : `absolute left-[5rem] h-full w-[5rem] items-center justify-center ${className}`;

  return (
    <View
      className={wrapperClassName}
      style={style}
    >
      <View
        className="h-full w-[0.2rem]"
        style={{ backgroundColor: color ? `#${color}` : "#D9D9D9" }}
      />
    </View>
  );
}

export default LineBox;
