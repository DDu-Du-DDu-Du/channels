import { View } from "react-native";

import { StatsScreen } from "@/features/stats/components";

export default function Stats() {
  return (
    <View className="flex-1 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg">
      <StatsScreen />
    </View>
  );
}
