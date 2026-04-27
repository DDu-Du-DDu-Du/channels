import { useEffect } from "react";
import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { handleIsDesignTokenLabEnabled } from "@/constants/app-variant";
import { DesignSystemScreen } from "@/features/settings";

import { Href, useRouter } from "expo-router";

function DesignSystem() {
  const isDesignTokenLabEnabled = handleIsDesignTokenLabEnabled();
  const router = useRouter();

  useEffect(() => {
    if (isDesignTokenLabEnabled) {
      return;
    }

    router.replace("/settings" as Href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (!isDesignTokenLabEnabled) {
    return null;
  }

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="디자인 시스템"
        titleClassName="text-size18 text-role-text-primary dark:text-role-dark-text-primary"
        className="px-[2.4rem] pb-[2.8rem] pt-[2rem]"
        rightContent={<HeaderRightActions />}
      />
      <DesignSystemScreen />
    </View>
  );
}

export default DesignSystem;
