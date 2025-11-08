import { useState } from "react";
import { View } from "react-native";

import { SpoqaText } from "@/components";
import InputDateSingle from "@/components/input-date/components/input-date-single/input-date-single";

export interface InputDateSingleViewProps {
  label?: string;
  value?: string;
  todayDate?: string;
  minDate?: string;
  maxDate?: string;
  onChange?: (val: string) => void;
}

function InputDateSingleView({
  label = "날짜 선택",
  value,
  todayDate,
  minDate,
  maxDate,
  onChange,
}: InputDateSingleViewProps) {
  const [val, setVal] = useState<string | undefined>(value);

  return (
    <View className="flex-1 items-center justify-center p-4 gap-[1.2rem]">
      <InputDateSingle
        label={val ?? label}
        value={val}
        onChange={(next) => {
          setVal(next);
          onChange?.(next);
        }}
        todayDate={todayDate}
        minDate={minDate}
        maxDate={maxDate}
      />
      <SpoqaText className="text-size13">현재 값: {val ?? "(없음)"}</SpoqaText>
    </View>
  );
}

export default InputDateSingleView;
