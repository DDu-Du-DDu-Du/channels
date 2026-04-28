import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { usePageHeaderBackRoute } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ArrowLeftIcon } from "@/icons";

const DEFAULT_CLASS_NAME = "px-[2.4rem] py-[2rem]";
const DEFAULT_TITLE_CLASS_NAME =
  "text-size15 text-role-text-primary dark:text-role-dark-text-primary";

export interface PageHeaderProps {
  title: string;
  onPressBack?: () => void;
  showBackButton?: boolean;
  titleClassName?: string;
  className?: string;
  iconStroke?: string;
  rightContent?: ReactNode;
}

function PageHeader({
  title = " ",
  onPressBack,
  showBackButton = true,
  titleClassName,
  className,
  iconStroke,
  rightContent,
}: PageHeaderProps) {
  const { handlePressBack } = usePageHeaderBackRoute();
  const defaultIconStroke = useThemeColorToken("ui.icon.default");
  const resolvedIconStroke = iconStroke ?? defaultIconStroke;
  const resolvedClassName = `${DEFAULT_CLASS_NAME} ${className ?? ""}`;
  const resolvedTitleClassName = `${DEFAULT_TITLE_CLASS_NAME} ${titleClassName ?? ""}`;

  return (
    <View className={resolvedClassName}>
      <View className="items-center justify-center">
        <SpoqaText
          weight="bold"
          className={resolvedTitleClassName}
        >
          {title}
        </SpoqaText>
        <View className="w-full flex-row-reverse justify-between absolute">
          {rightContent}
          {showBackButton ? (
            <Pressable
              onPress={onPressBack ?? handlePressBack}
              className="size-[2.4rem] items-start justify-center"
              hitSlop={8}
            >
              <ArrowLeftIcon
                size={16}
                stroke={resolvedIconStroke}
              />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default PageHeader;
