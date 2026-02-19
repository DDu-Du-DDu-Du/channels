import { View } from "react-native";

import { MainFeed } from "@/features/feed/components";

export default function Feed() {
  return (
    <View className="flex-1 bg-main">
      <View className="w-full flex-1">
        <MainFeed />
      </View>
    </View>
  );
}
