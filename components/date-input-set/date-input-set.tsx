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
        className="flex-1 rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1rem] py-[0.8rem]"
        onPress={onPressStart}
      >
        <SpoqaText className="mb-[0.4rem] text-size11 text-role-text-secondary dark:text-role-dark-text-secondary">
          {startLabel}
        </SpoqaText>
        <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
          {startDate}
        </SpoqaText>
      </Pressable>
      <Pressable
        className="flex-1 rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1rem] py-[0.8rem]"
        onPress={onPressEnd}
      >
        <SpoqaText className="mb-[0.4rem] text-size11 text-role-text-secondary dark:text-role-dark-text-secondary">
          {endLabel}
        </SpoqaText>
        <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
          {endDate}
        </SpoqaText>
      </Pressable>
    </View>
  );
}

export default DateInputSet;
