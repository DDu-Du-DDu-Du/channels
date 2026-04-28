import { View } from "react-native";

import { HeaderRightActions, MemberGuide, PageHeader } from "@/components";
import { NotificationScreen } from "@/features/notification";
import { useAuthStore } from "@/stores";

function Notification() {
  const isGuestSession = useAuthStore((state) => state.sessionType === "guest");

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="알림"
        rightContent={<HeaderRightActions />}
      />
      {isGuestSession ? <MemberGuide /> : <NotificationScreen />}
    </View>
  );
}

export default Notification;
