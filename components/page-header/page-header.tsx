import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ArrowLeftIcon } from "@/icons";

export interface PageHeaderProps {
  title: string;
  onPressBack?: () => void;
  titleClassName?: string;
  className?: string;
  iconStroke?: string;
  rightContent?: ReactNode;
}

function PageHeader({
  title,
  onPressBack,
  titleClassName = "text-size15 text-role-text-primary dark:text-role-dark-text-primary",
  className = "px-[2.4rem] pb-[1.6rem] pt-[2.4rem]",
  iconStroke,
  rightContent,
}: PageHeaderProps) {
  const defaultIconStroke = useThemeColorToken("ui.icon.default");
  const resolvedIconStroke = iconStroke ?? defaultIconStroke;

  return (
    <View className={className}>
      <View className="relative items-center justify-center">
        {onPressBack ? (
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
        ) : null}

        <SpoqaText
          weight="bold"
          className={titleClassName}
        >
          {title}
        </SpoqaText>

        {rightContent ? <View className="absolute right-0 top-0">{rightContent}</View> : null}
      </View>
    </View>
  );
}

export default PageHeader;
