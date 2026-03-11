import { ReactNode } from "react";
import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ChevronRightIcon } from "@/icons";

interface SettingsRowProps {
  label: string;
  leftContent?: ReactNode;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightContent?: ReactNode;
  textColor?: string;
  hasBottomBorder?: boolean;
}

function SettingsRow({
  label,
  leftContent,
  value,
  onPress,
  showChevron = false,
  rightContent,
  textColor,
  hasBottomBorder = true,
}: SettingsRowProps) {
  const defaultTextColor = useThemeColorToken("role.text.primary");
  const resolvedTextColor = textColor ?? defaultTextColor;
  const chevronColor = useThemeColorToken("role.icon.muted");
  const rowClassName = `min-h-[5.2rem] flex-row items-center justify-between py-[1.2rem] ${
    hasBottomBorder ? "border-b border-role-border-subtle dark:border-role-dark-border-subtle" : ""
  }`;

  const content = (
    <>
      <View className="flex-row items-center gap-[0.6rem]">
        {leftContent}
        <SpoqaText
          weight="medium"
          className="text-size15"
          style={{ color: resolvedTextColor }}
        >
          {label}
        </SpoqaText>
      </View>
      <View className="flex-row items-center gap-[0.6rem]">
        {value ? (
          <SpoqaText className="text-size13 text-role-text-secondary dark:text-role-dark-text-secondary">
            {value}
          </SpoqaText>
        ) : null}
        {rightContent}
        {showChevron ? (
          <ChevronRightIcon
            size={16}
            fill={chevronColor}
          />
        ) : null}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={rowClassName}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={rowClassName}>{content}</View>;
}

export default SettingsRow;
