import { Pressable, View } from "react-native";

import { ShakingCheckIcon, SpoqaText } from "@/components";

interface MonthSelectionSectionProps {
  inputLabel: string;
  suffixLabel?: string;
  isRangeEnabled: boolean;
  handlePressTitle: () => void;
  handleToggleRange: () => void;
}

function MonthSelectionSection({
  inputLabel,
  suffixLabel = "통계",
  isRangeEnabled,
  handlePressTitle,
  handleToggleRange,
}: MonthSelectionSectionProps) {
  return (
    <View className="mt-[2rem]">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Pressable
            accessibilityRole="button"
            onPress={handlePressTitle}
            className="self-start rounded-radius10 bg-sub_1 px-[1.2rem] py-[0.9rem]"
          >
            <SpoqaText
              weight="bold"
              className="text-size18 text-black_500"
            >
              {inputLabel}
            </SpoqaText>
          </Pressable>
          <SpoqaText
            weight="bold"
            className="ml-[0.6rem] text-size16 text-black_500"
          >
            {suffixLabel}
          </SpoqaText>
        </View>

        <View className="ml-[1.2rem] flex-row items-center">
          <ShakingCheckIcon
            isChecked={isRangeEnabled}
            color="000000"
            size={19}
            onPress={handleToggleRange}
          />
          <Pressable
            onPress={handleToggleRange}
            className="ml-[0.6rem]"
          >
            <SpoqaText className="text-size12 text-black_500">복수선택</SpoqaText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default MonthSelectionSection;
