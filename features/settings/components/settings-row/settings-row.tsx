import { ReactNode } from "react";
import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
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
  textColor = "#1F1F1F",
  hasBottomBorder = true,
}: SettingsRowProps) {
  const rowClassName = `min-h-[5.2rem] flex-row items-center justify-between py-[1.2rem] ${
    hasBottomBorder ? "border-b border-[#E5E5E5]" : ""
  }`;

  const content = (
    <>
      <View className="flex-row items-center gap-[0.6rem]">
        {leftContent}
        <SpoqaText
          weight="medium"
          className="text-size15"
          style={{ color: textColor }}
        >
          {label}
        </SpoqaText>
      </View>
      <View className="flex-row items-center gap-[0.6rem]">
        {value ? (
          <SpoqaText className="text-size13 text-example_gray_900">{value}</SpoqaText>
        ) : null}
        {rightContent}
        {showChevron ? (
          <ChevronRightIcon
            size={16}
            stroke="#9C9C9C"
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
