import { View } from "react-native";

import { StatsGoalSelectScreen } from "@/features/stats/components";

export default function Select() {
  return (
    <View className="flex-1 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg">
      <StatsGoalSelectScreen />
    </View>
  );
}
