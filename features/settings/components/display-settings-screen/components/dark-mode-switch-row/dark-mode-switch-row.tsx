import { useTranslation } from "react-i18next";

import { AnimatedSwitch } from "@/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { MoonIcon, SunIcon } from "@/icons";

import { SettingsRow } from "../../../settings-row";

interface DarkModeSwitchRowProps {
  isDarkMode: boolean;
  handleToggleDarkMode: (next: boolean) => void;
}

function DarkModeSwitchRow({ isDarkMode, handleToggleDarkMode }: DarkModeSwitchRowProps) {
  const { t } = useTranslation();
  const offIconColor = useThemeColorToken("role.icon.default");
  const onIconColor = useThemeColorToken("role.icon.inverse");
  const offBackgroundColor = useThemeColorToken("role.surface.subtle");
  const onBackgroundColor = useThemeColorToken("role.surface.muted");
  const offThumbColor = useThemeColorToken("role.surface.canvas");
  const onThumbColor = useThemeColorToken("role.surface.canvas");

  return (
    <SettingsRow
      label={t("settings.display.darkMode")}
      rightContent={
        <AnimatedSwitch
          size="large"
          value={isDarkMode}
          onValueChange={handleToggleDarkMode}
          offIcon={
            <SunIcon
              size={16}
              fill={offIconColor}
            />
          }
          onIcon={
            <MoonIcon
              size={16}
              fill={onIconColor}
            />
          }
          offBackgroundColor={offBackgroundColor}
          onBackgroundColor={onBackgroundColor}
          offThumbColor={offThumbColor}
          onThumbColor={onThumbColor}
        />
      }
    />
  );
}

export default DarkModeSwitchRow;
