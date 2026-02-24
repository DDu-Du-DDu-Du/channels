import { Pressable, View } from "react-native";

import { SelectChip, SpoqaText } from "@/components";
import { useDisplaySettings } from "@/features/settings/hooks";
import { ArrowLeftIcon } from "@/icons";

import { SettingsRow } from "../settings-row";
import { DarkModeSwitchRow } from "./components";

import { useRouter } from "expo-router";

function DisplaySettingsScreen() {
  const router = useRouter();
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
            stroke="#1F1F1F"
          />
        </Pressable>
        <SpoqaText
          weight="bold"
          className="text-size18 text-black_500"
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
              selectedBackgroundColor="#DDE9FF"
              borderColor="#C9D8F5"
              selectedTextClassName="text-main"
            />
            <SelectChip
              label="월"
              selected={weekStartDay === "mon"}
              onPress={() => handleChangeWeekStartDay("mon")}
              selectedBackgroundColor="#DDE9FF"
              borderColor="#C9D8F5"
              selectedTextClassName="text-main"
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
