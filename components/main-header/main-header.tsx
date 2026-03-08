import { Pressable, StyleSheet, View } from "react-native";

import { NotificationIcon, SettingsIcon } from "@/icons";

import { Href, useRouter } from "expo-router";

function MainHeader() {
  const router = useRouter();

  const handlePressNotification = () => {
    router.push("/notification" as Href);
  };

  const handlePressSettings = () => {
    router.push("/settings" as Href);
  };

  return (
    <View style={styles.root}>
      <View
        className="pt-[2rem] pb-[1.5rem] px-[2.4rem] bg-main flex flex-row justify-end items-center"
        style={styles.headerLayer}
      >
        <View className="flex flex-row justify-end gap-[0.8rem]">
          <Pressable
            onPress={handlePressNotification}
            hitSlop={8}
            className="size-[2.4rem] items-center justify-center"
          >
            <NotificationIcon stroke="#FFFFFF" />
          </Pressable>
          <Pressable
            onPress={handlePressSettings}
            hitSlop={8}
            className="size-[2.4rem] items-center justify-center"
          >
            <SettingsIcon stroke="#FFFFFF" />
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
