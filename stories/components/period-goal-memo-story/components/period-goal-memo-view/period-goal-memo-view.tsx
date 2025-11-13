import { useState } from "react";
import { View } from "react-native";

import { PeriodGoalMemo } from "@/components";

export interface PeriodGoalMemoViewProps {
  type?: "week" | "month";
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

function PeriodGoalMemoView({
  type = "month",
  value: initial = "",
  onChange,
  onBlur,
}: PeriodGoalMemoViewProps) {
  const [value, setValue] = useState(initial);

  return (
    <View className="flex-1 items-center justify-center p-4 gap-[1.2rem] w-full max-w-[60rem]">
      <PeriodGoalMemo
        type={type}
        value={value}
        onChange={(v) => {
          setValue(v);
          onChange?.(v);
        }}
        onBlur={onBlur}
      />
    </View>
  );
}

export default PeriodGoalMemoView;
