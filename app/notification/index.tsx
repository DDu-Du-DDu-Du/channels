import { View } from "react-native";

import { PageHeader } from "@/components";
import { NotificationScreen } from "@/features/notification";

function Notification() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="알림"
        titleClassName="text-size18 text-role-text-primary dark:text-role-dark-text-primary"
        className="px-[2.4rem] pb-[2.6rem] pt-[2.4rem]"
      />
      <NotificationScreen />
    </View>
  );
}

export default Notification;
