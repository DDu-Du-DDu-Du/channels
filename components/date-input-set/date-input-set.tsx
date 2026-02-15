import { Pressable, View } from "react-native";

import SpoqaText from "../spoqa-text/spoqa-text";

export interface DateInputSetProps {
  startDate: string;
  endDate: string;
  startLabel?: string;
  endLabel?: string;
  onPressStart: () => void;
  onPressEnd: () => void;
}

function DateInputSet({
  startDate,
  endDate,
  startLabel = "시작일",
  endLabel = "종료일",
  onPressStart,
  onPressEnd,
}: DateInputSetProps) {
  return (
    <View className="flex-row gap-[0.8rem]">
      <Pressable
        className="flex-1 rounded-radius15 bg-white_100 px-[1rem] py-[0.8rem]"
        onPress={onPressStart}
      >
        <SpoqaText className="mb-[0.4rem] text-size11 text-example_gray_900">
          {startLabel}
        </SpoqaText>
        <SpoqaText className="text-size14 text-black">{startDate}</SpoqaText>
      </Pressable>
      <Pressable
        className="flex-1 rounded-radius15 bg-white_100 px-[1rem] py-[0.8rem]"
        onPress={onPressEnd}
      >
        <SpoqaText className="mb-[0.4rem] text-size11 text-example_gray_900">{endLabel}</SpoqaText>
        <SpoqaText className="text-size14 text-black">{endDate}</SpoqaText>
      </Pressable>
    </View>
  );
}

export default DateInputSet;
