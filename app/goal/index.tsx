import { View } from "react-native";

import { GoalHeader, GoalList } from "@/features/goal";

function Goal() {
  return (
    <View className="flex-1 bg-main">
      <GoalHeader />
      <GoalList />
    </View>
  );
}

export default Goal;
