import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { AnimatedSwitch, SpoqaText } from "@/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { NotionIcon } from "@/icons";

import { SettingsRow } from "../../../settings-row";

interface ToggleHandler {
  isToggle: boolean;
  handleValueChange: (next: boolean) => void;
}

interface RealtimeSyncSectionProps {
  notion: ToggleHandler;
  googleCalendar: ToggleHandler;
  microsoftTodo: ToggleHandler;
}

function RealtimeSyncSection({ notion, googleCalendar, microsoftTodo }: RealtimeSyncSectionProps) {
  const { t } = useTranslation();
  const offBackgroundColor = useThemeColorToken("role.surface.subtle");
  const onBackgroundColor = useThemeColorToken("ui.button.primary.bg");
  const thumbColor = useThemeColorToken("role.surface.canvas");

  return (
    <View className="pt-[2rem]">
      <SpoqaText
        weight="semiBold"
        className="mb-[0.8rem] text-size14 text-role-text-primary dark:text-role-dark-text-primary"
      >
        {t("settings.realtimeSync")}
      </SpoqaText>

      <View className="overflow-hidden rounded-radius10 border border-role-border-subtle dark:border-role-dark-border-subtle bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.4rem]">
        <SettingsRow
          label="Notion"
          leftContent={<NotionIcon size={16} />}
          rightContent={
            <AnimatedSwitch
              size="large"
              value={notion.isToggle}
              onValueChange={notion.handleValueChange}
              offBackgroundColor={offBackgroundColor}
              onBackgroundColor={onBackgroundColor}
              offThumbColor={thumbColor}
              onThumbColor={thumbColor}
            />
          }
        />
        <SettingsRow
          label="Google Calendar"
          rightContent={
            <AnimatedSwitch
              size="large"
              value={googleCalendar.isToggle}
              onValueChange={googleCalendar.handleValueChange}
              offBackgroundColor={offBackgroundColor}
              onBackgroundColor={onBackgroundColor}
              offThumbColor={thumbColor}
              onThumbColor={thumbColor}
            />
          }
        />
        <SettingsRow
          label="Microsoft To-Do"
          hasBottomBorder={false}
          rightContent={
            <AnimatedSwitch
              size="large"
              value={microsoftTodo.isToggle}
              onValueChange={microsoftTodo.handleValueChange}
              offBackgroundColor={offBackgroundColor}
              onBackgroundColor={onBackgroundColor}
              offThumbColor={thumbColor}
              onThumbColor={thumbColor}
            />
          }
        />
      </View>
    </View>
  );
}

export default RealtimeSyncSection;
