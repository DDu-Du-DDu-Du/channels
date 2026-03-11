import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";
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
  titleClassName = "text-size15 text-role-text-inverse dark:text-role-dark-text-inverse",
  iconStroke,
  className = "px-[2.4rem] pb-[1.6rem] pt-[2.4rem]",
}: FormHeaderProps) {
  const defaultIconStroke = useThemeColorToken("role.icon.inverse");
  const resolvedIconStroke = iconStroke ?? defaultIconStroke;

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
              stroke={resolvedIconStroke}
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
