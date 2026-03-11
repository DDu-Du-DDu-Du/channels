import { View } from "react-native";

import { NotificationScreen } from "@/features/notification";

function Notification() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <NotificationScreen />
    </View>
  );
}

export default Notification;
