import React from "react";
import { Pressable, View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";

export interface FormSectionProps {
  label: string;
  rightContent?: React.ReactNode;
  onPress?: () => void;
  labelClassName?: string;
  className?: string;
}

function FormSection({
  label,
  rightContent,
  onPress,
  labelClassName = "text-size14 text-role-text-inverse dark:text-role-dark-text-inverse",
  className = "",
}: FormSectionProps) {
  const content = (
    <>
      <SpoqaText className={labelClassName}>{label}</SpoqaText>
      {rightContent}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`h-[5.6rem] w-full flex-row items-center justify-between ${className}`}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View className={`h-[5.6rem] w-full flex-row items-center justify-between ${className}`}>
      {content}
    </View>
  );
}

export default FormSection;
