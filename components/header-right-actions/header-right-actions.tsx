import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

import { useNotificationInboxStatusQuery } from "@/features/notification/queries";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { NotificationIcon, SettingsIcon } from "@/icons";

import { Href, usePathname, useRouter } from "expo-router";

interface HeaderRightActionsProps {
  action?: ReactNode;
}

function HeaderRightActions({ action }: HeaderRightActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const iconStroke = useThemeColorToken("ui.icon.default");
  const { data: notificationStatus } = useNotificationInboxStatusQuery();

  const handlePressNotification = () => {
    if (pathname.startsWith("/notification")) {
      return;
    }

    router.push("/notification" as Href);
  };

  const handlePressSettings = () => {
    if (pathname.startsWith("/settings")) {
      return;
    }

    router.push("/settings" as Href);
  };

  return (
    <View className="flex-row justify-end gap-[0.8rem]">
      {action}
      <Pressable
        onPress={handlePressNotification}
        hitSlop={8}
        className="relative size-[2.4rem] items-center justify-center"
      >
        <NotificationIcon stroke={iconStroke} />
        {notificationStatus?.hasNew ? (
          <View className="absolute right-[0.1rem] top-[0.1rem] size-[0.7rem] rounded-circle bg-role-status-error dark:bg-role-dark-status-error" />
        ) : null}
      </Pressable>
      <Pressable
        onPress={handlePressSettings}
        hitSlop={8}
        className="size-[2.4rem] items-center justify-center"
      >
        <SettingsIcon stroke={iconStroke} />
      </Pressable>
    </View>
  );
}

export default HeaderRightActions;
