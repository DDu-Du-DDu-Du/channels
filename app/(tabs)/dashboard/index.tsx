import { View } from "react-native";

import { RootTabHeader, SpoqaText } from "@/components";

function Dashboard() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <RootTabHeader />
      <View className="flex-1 items-center justify-center">
        <SpoqaText className="text-size16 text-role-text-primary dark:text-role-dark-text-primary">
          대시보드
        </SpoqaText>
      </View>
    </View>
  );
}

export default Dashboard;
