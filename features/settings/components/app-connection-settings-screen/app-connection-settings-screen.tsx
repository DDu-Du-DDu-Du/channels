import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { useAppConnectionSettings } from "@/features/settings/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ArrowLeftIcon, NotionIcon } from "@/icons";

import { SettingsRow } from "../settings-row";
import { ConnectionActionButtons, RealtimeSyncSection } from "./components";

import { useRouter } from "expo-router";

function AppConnectionSettingsScreen() {
  const router = useRouter();
  const iconStroke = useThemeColorToken("role.icon.default");
  const realtimeSyncSettings = useAppConnectionSettings();

  const handlePressBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 px-[2.4rem] pb-[2.8rem] pt-[2.4rem]">
      <View className="relative items-center justify-center pb-[2.8rem]">
        <Pressable
          onPress={handlePressBack}
          className="absolute left-0 top-0 size-[2.4rem] items-start justify-center"
          hitSlop={8}
        >
          <ArrowLeftIcon
            size={16}
            stroke={iconStroke}
          />
        </Pressable>
        <SpoqaText
          weight="bold"
          className="text-size18 text-role-text-primary dark:text-role-dark-text-primary"
        >
          앱 연결
        </SpoqaText>
      </View>

      <SettingsRow
        label="Notion"
        leftContent={<NotionIcon size={16} />}
        rightContent={<ConnectionActionButtons />}
      />
      <SettingsRow
        label="Google Calendar"
        rightContent={<ConnectionActionButtons />}
      />
      <SettingsRow
        label="Microsoft To-Do"
        rightContent={<ConnectionActionButtons />}
      />

      <RealtimeSyncSection
        notion={realtimeSyncSettings.notion}
        googleCalendar={realtimeSyncSettings.googleCalendar}
        microsoftTodo={realtimeSyncSettings.microsoftTodo}
      />
    </View>
  );
}

export default AppConnectionSettingsScreen;
