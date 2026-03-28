import { View } from "react-native";

import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ExclamationIcon } from "@/icons";

import SpoqaText from "../spoqa-text/spoqa-text";

export interface EmptyListProps {
  text: string;
  className?: string;
  textClassName?: string;
  iconStroke?: string;
}

function EmptyList({
  text,
  className = "w-full items-center py-[2.4rem]",
  textClassName = "mt-[0.8rem] text-size14 text-role-text-inverse dark:text-role-dark-text-inverse",
  iconStroke,
}: EmptyListProps) {
  const defaultIconStroke = useThemeColorToken("role.icon.default");
  const resolvedIconStroke = iconStroke ?? defaultIconStroke;

  return (
    <View className={className}>
      <ExclamationIcon
        size={24}
        stroke={resolvedIconStroke}
      />
      <SpoqaText className={textClassName}>{text}</SpoqaText>
    </View>
  );
}

export default EmptyList;
