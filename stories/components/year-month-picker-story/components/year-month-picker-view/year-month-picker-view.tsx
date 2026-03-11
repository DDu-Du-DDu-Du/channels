import { useState } from "react";
import { Pressable, View } from "react-native";

import { SpoqaText, YearMonthPickerSheet } from "@/components";
import { YearMonthValue } from "@/components/year-month-picker/year-month-picker";

export interface YearMonthPickerViewProps {
  rangeEnabled?: boolean;
}

function YearMonthPickerView({ rangeEnabled = false }: YearMonthPickerViewProps) {
  const now = new Date();
  const initialValue: YearMonthValue = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };

  const [open, setOpen] = useState(false);
  const [isRangeEnabled, setIsRangeEnabled] = useState(rangeEnabled);
  const [singleValue, setSingleValue] = useState<YearMonthValue>(initialValue);
  const [fromValue, setFromValue] = useState<YearMonthValue>(initialValue);
  const [toValue, setToValue] = useState<YearMonthValue>(initialValue);

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Pressable
        className="rounded-radius10 bg-role-surface-subtle dark:bg-role-dark-surface-subtle px-[1.6rem] py-[1rem]"
        onPress={() => setOpen(true)}
      >
        <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
          Open YearMonthPicker
        </SpoqaText>
      </Pressable>

      <Pressable
        className="mt-[1.2rem] rounded-radius10 bg-role-surface-subtle dark:bg-role-dark-surface-subtle px-[1.6rem] py-[1rem]"
        onPress={() => setIsRangeEnabled((prev) => !prev)}
      >
        <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">{`Range: ${isRangeEnabled ? "On" : "Off"}`}</SpoqaText>
      </Pressable>

      <YearMonthPickerSheet
        open={open}
        isRangeEnabled={isRangeEnabled}
        singleValue={singleValue}
        fromValue={fromValue}
        toValue={toValue}
        onChangeSingle={setSingleValue}
        onChangeFrom={setFromValue}
        onChangeTo={setToValue}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}

export default YearMonthPickerView;
