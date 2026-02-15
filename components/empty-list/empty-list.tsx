import { View } from "react-native";

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
  textClassName = "mt-[0.8rem] text-size14 text-white",
  iconStroke = "#FFFFFF",
}: EmptyListProps) {
  return (
    <View className={className}>
      <ExclamationIcon
        size={24}
        stroke={iconStroke}
      />
      <SpoqaText className={textClassName}>{text}</SpoqaText>
    </View>
  );
}

export default EmptyList;
