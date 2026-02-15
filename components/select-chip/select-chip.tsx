import { Pressable } from "react-native";

import SpoqaText from "../spoqa-text/spoqa-text";

export interface SelectChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  className?: string;
  selectedBackgroundColor?: string;
  unselectedBackgroundColor?: string;
  selectedTextClassName?: string;
  unselectedTextClassName?: string;
  borderColor?: string;
  borderWidth?: number;
}

function SelectChip({
  label,
  selected,
  onPress,
  className,
  selectedBackgroundColor = "#F0F0F0",
  unselectedBackgroundColor = "#FFFFFF",
  selectedTextClassName = "text-black",
  unselectedTextClassName = "text-black",
  borderColor = "#D9D9D9",
  borderWidth = 1,
}: SelectChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-[3.2rem] min-w-[3.2rem] items-center justify-center rounded-radius10 px-[0.8rem] ${className ?? ""}`}
      style={{
        backgroundColor: selected ? selectedBackgroundColor : unselectedBackgroundColor,
        borderColor,
        borderWidth,
      }}
    >
      <SpoqaText
        className={`text-size12 ${selected ? selectedTextClassName : unselectedTextClassName}`}
      >
        {label}
      </SpoqaText>
    </Pressable>
  );
}

export default SelectChip;
