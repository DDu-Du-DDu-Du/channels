import { View } from "react-native";

import { GoalHeader, GoalList } from "@/features/goal";

function Goal() {
  return (
    <View className="flex-1 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg">
      <GoalHeader />
      <GoalList />
    </View>
  );
}

export default Goal;
