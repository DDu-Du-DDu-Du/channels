import { Pressable, TextInput, View } from "react-native";

import { CheckIcon } from "@/icons";

import { usePeriodGoalMemo } from "./hooks";

export type PeriodType = "week" | "month";

interface PeriodGoalMemoProps {
  type?: PeriodType;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onSubmit?: () => void;
}

function PeriodGoalMemo({
  type = "month",
  value,
  onChange,
  onBlur,
  onSubmit,
}: PeriodGoalMemoProps) {
  const { inputRef, isFocused, handleFocus, handleBlur, handleOutsidePress, height } =
    usePeriodGoalMemo({ onBlur });

  return (
    <View className="relative w-[31.2rem] h-full justify-start">
      {isFocused && (
        <Pressable
          onPress={handleOutsidePress}
          className="absolute inset-0 items-center justify-center z-monthly_goal_overlay"
        >
          <View className="bg-black_500/20 w-[60rem] h-full" />
        </Pressable>
      )}

      <View className="relative z-monthly_goal_textarea w-full">
        {isFocused && (
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={onSubmit}
            className="absolute right-[0.8rem] top-[0.8rem]"
          >
            <CheckIcon size={24} />
          </Pressable>
        )}
        <TextInput
          ref={inputRef}
          multiline
          textAlignVertical="top"
          placeholder={
            type === "week" ? "주 별 목표를 설정해보세요!" : "월 별 목표를 설정해보세요!"
          }
          className="w-full min-h-[4.6rem] max-h-[20rem] p-6 bg-example_gray_100 rounded-radius10 text-size11"
          value={value}
          onChangeText={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{ height: height ?? undefined }}
        />
      </View>
    </View>
  );
}

export default PeriodGoalMemo;
