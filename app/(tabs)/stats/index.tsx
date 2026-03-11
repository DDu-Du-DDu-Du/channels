import { View } from "react-native";

import { StatsScreen } from "@/features/stats/components";

export default function Stats() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <StatsScreen />
    </View>
  );
}
