import { TextInput, View } from "react-native";

import { remToPx } from "@/utils";

import { usePeriodGoalMemo } from "./hooks";

export type PeriodType = "WEEK" | "MONTH";

interface PeriodGoalMemoProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  minHeight?: number | string;
  maxHeight?: number | string;
}

function PeriodGoalMemo({
  value,
  onChange,
  onBlur,
  className,
  minHeight = "60px",
  maxHeight,
}: PeriodGoalMemoProps) {
  const { inputRef, handleFocus, handleBlur, height } = usePeriodGoalMemo({
    onBlur,
    minHeight,
    maxHeight,
  });

  return (
    <View
      className={`${className} relative w-full rounded-radius10`}
      style={{ marginBottom: remToPx(minHeight) + 10 }}
    >
      <View className="absolute z-monthly_goal_textarea w-full bg-example_gray_200 rounded-radius10 p-3">
        <TextInput
          ref={inputRef}
          multiline
          textAlignVertical="top"
          className="text-size11"
          value={value}
          onChangeText={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{ height }}
        />
      </View>
    </View>
  );
}

export default PeriodGoalMemo;
