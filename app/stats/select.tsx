import { View } from "react-native";

import { PageHeader } from "@/components";
import { StatsGoalSelectScreen } from "@/features/stats/components";

export default function Select() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="목표 상세통계"
        titleClassName="text-size15 text-role-text-inverse dark:text-role-dark-text-inverse"
      />
      <StatsGoalSelectScreen />
    </View>
  );
}
