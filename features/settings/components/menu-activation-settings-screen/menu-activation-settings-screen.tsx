import { Pressable, View } from "react-native";

import { AnimatedSwitch, SpoqaText } from "@/components";
import { useMenuActivationToggles } from "@/features/settings/hooks";
import { ArrowLeftIcon } from "@/icons";

import { SettingsRow } from "../settings-row";

import { useRouter } from "expo-router";

function MenuActivationSettingsScreen() {
  const router = useRouter();
  const { calendar, dashboard, stats } = useMenuActivationToggles();

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
          메뉴 활성화
        </SpoqaText>
      </View>

      <SettingsRow
        label="캘린더"
        rightContent={
          <AnimatedSwitch
            size="large"
            value={calendar.isToggle}
            onValueChange={calendar.handleValueChange}
            offBackgroundColor="#E1E1E1"
            onBackgroundColor="#1363DE"
            offThumbColor="#FFFFFF"
            onThumbColor="#FFFFFF"
          />
        }
      />
      <SettingsRow
        label="대시보드"
        rightContent={
          <AnimatedSwitch
            size="large"
            value={dashboard.isToggle}
            onValueChange={dashboard.handleValueChange}
            offBackgroundColor="#E1E1E1"
            onBackgroundColor="#1363DE"
            offThumbColor="#FFFFFF"
            onThumbColor="#FFFFFF"
          />
        }
      />
      <SettingsRow
        label="통계"
        rightContent={
          <AnimatedSwitch
            size="large"
            value={stats.isToggle}
            onValueChange={stats.handleValueChange}
            offBackgroundColor="#E1E1E1"
            onBackgroundColor="#1363DE"
            offThumbColor="#FFFFFF"
            onThumbColor="#FFFFFF"
          />
        }
      />
    </View>
  );
}

export default MenuActivationSettingsScreen;
