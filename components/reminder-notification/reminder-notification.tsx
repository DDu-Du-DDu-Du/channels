import React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { parseUtc } from "@/utils";

import { Href, useRouter } from "expo-router";

export interface ReminderNotificationProps {
  id: string | number;
  title: string;
  body: string;
  context: string;
  createdAt: string;
  bgColor?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const resolveRightMetaText = (createdAt: string) => {
  try {
    const now = new Date();
    const targetDate = parseUtc(createdAt);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetStart = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
    );
    const diffDays = Math.floor((todayStart.getTime() - targetStart.getTime()) / DAY_MS);

    if (diffDays <= 0) {
      return "오늘 알림";
    }

    return `${diffDays}일 전 알림`;
  } catch {
    return "";
  }
};

function ReminderNotification({
  id,
  title,
  body,
  context,
  createdAt,
  bgColor,
  isLoading = false,
  disabled = false,
  onPress,
}: ReminderNotificationProps) {
  const router = useRouter();
  const defaultBgColor = useThemeColorToken("role.surface.panel");
  const resolvedBgColor = bgColor ?? defaultBgColor;
  const spinnerColor = useThemeColorToken("role.text.tertiary");
  const rightMetaText = resolveRightMetaText(createdAt);

  const handlePress = () => {
    if (disabled) {
      return;
    }

    if (onPress) {
      onPress();
      return;
    }

    if (!id || !context) {
      return;
    }

    const href = `/${context}/${id}`;
    router.push(href as Href);
  };

  return (
    <View className="w-full">
      <Pressable
        className="rounded-radius15 bg-role-surface-panel dark:bg-role-dark-surface-panel px-[2rem] py-[1.6rem]"
        style={{ backgroundColor: resolvedBgColor }}
        onPress={disabled ? undefined : handlePress}
      >
        <View className="flex-row items-start justify-between gap-[1.2rem]">
          <View className="flex-1 gap-[0.5rem]">
            <SpoqaText
              weight="semiBold"
              className="text-size13 leading-[1.8rem] text-role-text-primary dark:text-role-dark-text-primary"
            >
              {title}
            </SpoqaText>
            <SpoqaText className="text-size11 text-role-text-secondary dark:text-role-dark-text-secondary">
              {body}
            </SpoqaText>
          </View>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={spinnerColor}
            />
          ) : rightMetaText ? (
            <SpoqaText className="pt-[0.2rem] text-size11 text-role-text-secondary dark:text-role-dark-text-secondary">
              {rightMetaText}
            </SpoqaText>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

export default ReminderNotification;
