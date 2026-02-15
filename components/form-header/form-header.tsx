import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { ArrowLeftIcon } from "@/icons";

export interface FormHeaderProps {
  title: string;
  onPressBack?: () => void;
  titleClassName?: string;
  iconStroke?: string;
  className?: string;
}

function FormHeader({
  title,
  onPressBack,
  titleClassName = "text-size15 text-white",
  iconStroke = "#FFFFFF",
  className = "px-[2.4rem] pb-[1.6rem] pt-[2.4rem]",
}: FormHeaderProps) {
  return (
    <View className={className}>
      <View className="relative items-center justify-center">
        {onPressBack && (
          <Pressable
            onPress={onPressBack}
            className="absolute left-0 top-0 size-[2.4rem] items-start justify-center"
            hitSlop={8}
          >
            <ArrowLeftIcon
              size={16}
              stroke={iconStroke}
            />
          </Pressable>
        )}
        <SpoqaText
          weight="bold"
          className={titleClassName}
        >
          {title}
        </SpoqaText>
      </View>
    </View>
  );
}

export default FormHeader;
