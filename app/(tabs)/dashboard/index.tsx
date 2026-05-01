import { View } from "react-native";

import { RootTabHeader } from "@/components";
import { DashboardScreen } from "@/features/dashboard";

function Dashboard() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <RootTabHeader />
      <DashboardScreen />
    </View>
  );
}

export default Dashboard;
