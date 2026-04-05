import { Pressable, StyleSheet, View } from "react-native";

import { useNotificationInboxStatusQuery } from "@/features/notification/queries";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { NotificationIcon, SettingsIcon } from "@/icons";

import { Href, useRouter } from "expo-router";

function MainHeader() {
  const router = useRouter();
  const iconStroke = useThemeColorToken("ui.icon.default");
  const { data: notificationStatus } = useNotificationInboxStatusQuery();

  const handlePressNotification = () => {
    router.push("/notification" as Href);
  };

  const handlePressSettings = () => {
    router.push("/settings" as Href);
  };

  return (
    <View style={styles.root}>
      <View
        className="pt-[2rem] pb-[1.5rem] px-[2.4rem] bg-role-surface-panel dark:bg-role-dark-surface-panel flex flex-row justify-end items-center"
        style={styles.headerLayer}
      >
        <View className="flex flex-row justify-end gap-[0.8rem]">
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "relative",
  },
  headerLayer: {
    zIndex: 30,
    elevation: 30,
  },
});

export default MainHeader;
