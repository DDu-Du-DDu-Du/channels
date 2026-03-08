import { View } from "react-native";

import { SpoqaText } from "@/components";

function Dashboard() {
  return (
    <View className="flex-1 items-center justify-center bg-main">
      <SpoqaText className="text-size16 text-white_100">대시보드</SpoqaText>
    </View>
  );
}

export default Dashboard;
