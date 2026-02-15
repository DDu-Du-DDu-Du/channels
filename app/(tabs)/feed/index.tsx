import { View } from "react-native";

import { MainFeed, MainHeader } from "@/features/feed/components";

export default function Feed() {
  return (
    <View className="flex-1 bg-main">
      <View className="w-full flex-1">
        <MainHeader />
        <MainFeed />
      </View>
    </View>
  );
}
