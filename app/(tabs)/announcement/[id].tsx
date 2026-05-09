import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { AnnouncementDetailScreen } from "@/features/announcement";

export default function Id() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title={t("announcement.title")}
        rightContent={<HeaderRightActions />}
      />
      <AnnouncementDetailScreen />
    </View>
  );
}
