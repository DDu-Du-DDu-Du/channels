import { AnimatedSwitch } from "@/components";
import { MoonIcon, SunIcon } from "@/icons";

import { SettingsRow } from "../../../settings-row";

interface DarkModeSwitchRowProps {
  isDarkMode: boolean;
  handleToggleDarkMode: (next: boolean) => void;
}

function DarkModeSwitchRow({ isDarkMode, handleToggleDarkMode }: DarkModeSwitchRowProps) {
  return (
    <SettingsRow
      label="다크모드"
      rightContent={
        <AnimatedSwitch
          size="large"
          value={isDarkMode}
          onValueChange={handleToggleDarkMode}
          offIcon={
            <SunIcon
              size={16}
              fill="#4B5563"
            />
          }
          onIcon={
            <MoonIcon
              size={16}
              fill="#F9FAFB"
            />
          }
          offBackgroundColor="#E5E7EB"
          onBackgroundColor="#2F333A"
          offThumbColor="#FFFFFF"
          onThumbColor="#D1D5DB"
        />
      }
    />
  );
}

export default DarkModeSwitchRow;
