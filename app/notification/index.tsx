import { View } from "react-native";

import { EmptyList, PageHeader } from "@/components";
import { NotificationScreen } from "@/features/notification";
import { useAuthStore } from "@/stores";

function Notification() {
  const isGuestSession = useAuthStore((state) => state.sessionType === "guest");

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="알림"
        titleClassName="text-size18 text-role-text-primary dark:text-role-dark-text-primary"
        className="px-[2.4rem] pb-[2.6rem] pt-[2.4rem]"
      />
      {isGuestSession ? (
        <EmptyList
          text="회원 전용입니다. 로그인 후 더 많은 서비스를 경험하세요!"
          className="flex-1 items-center justify-center px-[2.4rem]"
        />
      ) : (
        <NotificationScreen />
      )}
    </View>
  );
}

export default Notification;
