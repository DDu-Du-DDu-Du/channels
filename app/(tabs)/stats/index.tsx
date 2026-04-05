import { View } from "react-native";

import { MemberGuide, RootTabHeader } from "@/components";
import { StatsScreen } from "@/features/stats/components";
import { useAuthStore } from "@/stores";

export default function Stats() {
  const isGuestSession = useAuthStore((state) => state.sessionType === "guest");

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <RootTabHeader />
      {isGuestSession ? <MemberGuide /> : <StatsScreen />}
    </View>
  );
}
