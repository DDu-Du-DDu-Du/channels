import { View } from "react-native";

import { GoalHeader, GoalList } from "@/features/goal";

function Goal() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <GoalHeader />
      <GoalList />
    </View>
  );
}

export default Goal;
