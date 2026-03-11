import { View } from "react-native";

import { AnnouncementDetailScreen } from "@/features/announcement";

export default function Id() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <AnnouncementDetailScreen />
    </View>
  );
}
