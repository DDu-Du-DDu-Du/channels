import { Pressable } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";

export interface RadioItemProps {
  id: string;
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
}

function RadioItem({ label, selected, onPress, disabled, className }: RadioItemProps) {
  const base =
    "px-[1.2rem] py-[1.4rem] text-size13 leading-[1.3rem] rounded-radius10 border-solid border-[1px] border-role-border-subtle dark:border-role-dark-border-subtle";
  const selectedCls = selected
    ? " font-medium bg-role-surface-panel dark:bg-role-dark-surface-panel"
    : "";
  const disabledCls = disabled ? " opacity-50" : "";

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`${base}${selectedCls}${disabledCls} ${className ?? ""}`}
    >
      <SpoqaText>{label}</SpoqaText>
    </Pressable>
  );
}

export default RadioItem;
