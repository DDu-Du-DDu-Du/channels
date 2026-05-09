import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { SelectChip } from "@/components";
import { useDisplaySettings } from "@/features/settings/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";

import { SettingsRow } from "../settings-row";
import { DarkModeSwitchRow } from "./components";

function DisplaySettingsScreen() {
  const { t } = useTranslation();
  const chipBorderColor = useThemeColorToken("role.border.default");
  const {
    weekStartDay,
    handleChangeWeekStartDay,
    isDarkMode,
    handleToggleDarkMode,
    language,
    handleChangeLanguage,
  } = useDisplaySettings();

  return (
    <View className="flex-1 px-[2.4rem] pb-[2.8rem]">
      <SettingsRow
        label={t("settings.display.weekStartDay")}
        rightContent={
          <View className="flex-row gap-[0.6rem]">
            <SelectChip
              label={t("settings.display.sunday")}
              selected={weekStartDay === "sun"}
              onPress={() => handleChangeWeekStartDay("sun")}
              borderColor={chipBorderColor}
              selectedTextClassName="text-role-text-secondary dark:text-role-dark-text-secondary"
            />
            <SelectChip
              label={t("settings.display.monday")}
              selected={weekStartDay === "mon"}
              onPress={() => handleChangeWeekStartDay("mon")}
              borderColor={chipBorderColor}
              selectedTextClassName="text-role-text-secondary dark:text-role-dark-text-secondary"
            />
          </View>
        }
      />

      <SettingsRow
        label={t("settings.display.language")}
        rightContent={
          <View className="flex-row gap-[0.6rem]">
            <SelectChip
              label={t("settings.display.english")}
              selected={language === "en"}
              onPress={() => handleChangeLanguage("en")}
              borderColor={chipBorderColor}
              selectedTextClassName="text-role-text-secondary dark:text-role-dark-text-secondary"
            />
            <SelectChip
              label={t("settings.display.korean")}
              selected={language === "ko"}
              onPress={() => handleChangeLanguage("ko")}
              borderColor={chipBorderColor}
              selectedTextClassName="text-role-text-secondary dark:text-role-dark-text-secondary"
            />
          </View>
        }
      />

      <DarkModeSwitchRow
        isDarkMode={isDarkMode}
        handleToggleDarkMode={handleToggleDarkMode}
      />
    </View>
  );
}

export default DisplaySettingsScreen;
