import { View } from "react-native";

import { NotificationScreen } from "@/features/notification";

function Notification() {
  return (
    <View className="flex-1 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg">
      <NotificationScreen />
    </View>
  );
}

export default Notification;
