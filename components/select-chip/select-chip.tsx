import { Pressable } from "react-native";

import { useThemeColorToken } from "@/hooks/use-theme-color";

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
  selectedBackgroundColor,
  unselectedBackgroundColor,
  selectedTextClassName = "text-role-text-primary dark:text-role-dark-text-primary",
  unselectedTextClassName = "text-role-text-primary dark:text-role-dark-text-primary",
  borderColor,
  borderWidth = 1,
}: SelectChipProps) {
  const defaultSelectedBackground = useThemeColorToken("role.surface.subtle");
  const defaultUnselectedBackground = useThemeColorToken("role.surface.canvas");
  const defaultBorderColor = useThemeColorToken("role.border.default");
  const selectedBackground = selectedBackgroundColor ?? defaultSelectedBackground;
  const unselectedBackground = unselectedBackgroundColor ?? defaultUnselectedBackground;
  const resolvedBorderColor = borderColor ?? defaultBorderColor;

  return (
    <Pressable
      onPress={onPress}
      className={`h-[3.2rem] min-w-[3.2rem] items-center justify-center rounded-radius10 px-[0.8rem] ${className ?? ""}`}
      style={{
        backgroundColor: selected ? selectedBackground : unselectedBackground,
        borderColor: resolvedBorderColor,
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
