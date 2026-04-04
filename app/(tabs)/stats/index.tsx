import { View } from "react-native";

import { EmptyList } from "@/components";
import { StatsScreen } from "@/features/stats/components";
import { useAuthStore } from "@/stores";

export default function Stats() {
  const isGuestSession = useAuthStore((state) => state.sessionType === "guest");

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      {isGuestSession ? (
        <EmptyList
          text="회원 전용입니다. 로그인 후 더 많은 서비스를 경험하세요!"
          className="flex-1 items-center justify-center px-[2.4rem]"
        />
      ) : (
        <StatsScreen />
      )}
    </View>
  );
}
