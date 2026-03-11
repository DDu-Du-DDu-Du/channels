import { View } from "react-native";

import { StatsGoalDetailScreen } from "@/features/stats/components";

export default function Id() {
  return (
    <View className="flex-1 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg">
      <StatsGoalDetailScreen />
    </View>
  );
}
