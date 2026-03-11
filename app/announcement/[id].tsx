import { View } from "react-native";

import { AnnouncementDetailScreen } from "@/features/announcement";

export default function Id() {
  return (
    <View className="flex-1 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg">
      <AnnouncementDetailScreen />
    </View>
  );
}
