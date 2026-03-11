import { View } from "react-native";

import { StatsGoalSelectScreen } from "@/features/stats/components";

export default function Select() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <StatsGoalSelectScreen />
    </View>
  );
}
