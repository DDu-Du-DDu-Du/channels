import { Pressable, View } from "react-native";

import { SelectChip, SpoqaText } from "@/components";
import { useDisplaySettings } from "@/features/settings/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ArrowLeftIcon } from "@/icons";

import { SettingsRow } from "../settings-row";
import { DarkModeSwitchRow } from "./components";

import { useRouter } from "expo-router";

function DisplaySettingsScreen() {
  const router = useRouter();
  const iconStroke = useThemeColorToken("role.icon.default");
  const chipBorderColor = useThemeColorToken("role.border.default");
  const { weekStartDay, handleChangeWeekStartDay, isDarkMode, handleToggleDarkMode } =
    useDisplaySettings();

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
          화면표시
        </SpoqaText>
      </View>

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
