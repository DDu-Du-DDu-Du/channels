import { View } from "react-native";

import { MemberGuide } from "@/components";
import { StatsScreen } from "@/features/stats/components";
import { useAuthStore } from "@/stores";

export default function Stats() {
  const isGuestSession = useAuthStore((state) => state.sessionType === "guest");

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      {isGuestSession ? <MemberGuide /> : <StatsScreen />}
    </View>
  );
}
