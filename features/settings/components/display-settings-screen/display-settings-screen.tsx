import { View } from "react-native";

import { SelectChip } from "@/components";
import { useDisplaySettings } from "@/features/settings/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";

import { SettingsRow } from "../settings-row";
import { DarkModeSwitchRow } from "./components";

function DisplaySettingsScreen() {
  const chipBorderColor = useThemeColorToken("role.border.default");
  const { weekStartDay, handleChangeWeekStartDay, isDarkMode, handleToggleDarkMode } =
    useDisplaySettings();

  return (
    <View className="flex-1 px-[2.4rem] pb-[2.8rem]">
      <SettingsRow
        label="주 시작일"
        rightContent={
          <View className="flex-row gap-[0.6rem]">
            <SelectChip
              label="일"
              selected={weekStartDay === "sun"}
              onPress={() => handleChangeWeekStartDay("sun")}
              borderColor={chipBorderColor}
              selectedTextClassName="text-role-text-secondary dark:text-role-dark-text-secondary"
            />
            <SelectChip
              label="월"
              selected={weekStartDay === "mon"}
              onPress={() => handleChangeWeekStartDay("mon")}
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
