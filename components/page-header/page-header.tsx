import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { usePageHeaderBackRoute, useWideLayout } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ArrowLeftIcon } from "@/icons";

const DEFAULT_CLASS_NAME = "px-[2.4rem] py-[2rem]";
const WIDE_CLASS_NAME = "px-[3.2rem] py-[2rem]";
const DEFAULT_TITLE_CLASS_NAME =
  "text-size15 text-role-text-primary dark:text-role-dark-text-primary";
const WIDE_HEADER_MAX_WIDTH = 1440;

export interface PageHeaderProps {
  title: string;
  onPressBack?: () => void;
  showBackButton?: boolean;
  titleClassName?: string;
  className?: string;
  iconStroke?: string;
  rightContent?: ReactNode;
  align?: "center" | "left";
}

function PageHeader({
  title = " ",
  onPressBack,
  showBackButton = true,
  titleClassName,
  className,
  iconStroke,
  rightContent,
  align = "center",
}: PageHeaderProps) {
  const { handlePressBack } = usePageHeaderBackRoute();
  const { isWideLayout } = useWideLayout();
  const defaultIconStroke = useThemeColorToken("ui.icon.default");
  const resolvedIconStroke = iconStroke ?? defaultIconStroke;
  const resolvedClassName = `${isWideLayout ? WIDE_CLASS_NAME : DEFAULT_CLASS_NAME} ${
    className ?? ""
  }`;
  const resolvedTitleClassName = `${DEFAULT_TITLE_CLASS_NAME} ${
    align === "left" && showBackButton ? "pl-[3.2rem]" : ""
  } ${titleClassName ?? ""}`;
  const contentClassName =
    align === "left" ? "items-start justify-center" : "items-center justify-center";
  const contentStyle = isWideLayout
    ? ({ alignSelf: "center", maxWidth: WIDE_HEADER_MAX_WIDTH, width: "100%" } as const)
    : undefined;

  return (
    <View className={resolvedClassName}>
      <View
        className={contentClassName}
        style={contentStyle}
      >
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
