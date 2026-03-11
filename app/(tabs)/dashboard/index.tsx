import { View } from "react-native";

import { SpoqaText } from "@/components";

function Dashboard() {
  return (
    <View className="flex-1 items-center justify-center bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg">
      <SpoqaText className="text-size16 text-role-text-inverse dark:text-role-dark-text-inverse">
        대시보드
      </SpoqaText>
    </View>
  );
}

export default Dashboard;
