import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";

interface StatsHeaderProps {
  yearMonthLabel: string;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
}

function StatsHeader({ yearMonthLabel, handlePrevMonth, handleNextMonth }: StatsHeaderProps) {
  return (
    <View className="mb-[1.6rem] rounded-radius15 bg-sub_1 px-[2rem] py-[1rem]">
      <View className="flex-row items-center justify-between">
        <Pressable
          className="size-[3rem] items-center justify-center rounded-circle bg-example_gray_300"
          hitSlop={8}
          onPress={handlePrevMonth}
        >
          <ChevronLeftIcon
            size={12}
            fill="#8E8E8E"
          />
        </Pressable>
        <SpoqaText
          weight="bold"
          className="text-size17 text-black_500"
        >
          {yearMonthLabel}
        </SpoqaText>
        <Pressable
          className="size-[3rem] items-center justify-center rounded-circle bg-example_gray_300"
          hitSlop={8}
          onPress={handleNextMonth}
        >
          <ChevronRightIcon
            size={12}
            fill="#8E8E8E"
          />
        </Pressable>
      </View>
    </View>
  );
}

export default StatsHeader;
