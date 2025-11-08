import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import BottomSingleCalendar from "@/components/calendar/bottom-single-calendar/bottom-single-calendar";

export interface InputDateSingleProps {
  label: string;
  value?: string;
  onChange?: (yyyyMmDd: string) => void;
  todayDate?: string;
  minDate?: string;
  maxDate?: string;
}

function InputDateSingle({
  label,
  value,
  onChange,
  todayDate,
  minDate,
  maxDate,
}: InputDateSingleProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : undefined);
  const current = useMemo(() => todayDate ?? new Date().toISOString().slice(0, 10), [todayDate]);

  const onChangeDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const next = `${yyyy}-${mm}-${dd}`;

    onChange?.(next);
    setOpen(false);
  };

  return (
    <View className="relative w-[12rem]">
      <Pressable
        accessibilityRole="button"
        className="h-[4rem] rounded-radius10 bg-example_gray_100 justify-center pl-[1.8rem]"
        onPress={() => setOpen(true)}
      >
        <SpoqaText className="text-size13">{label}</SpoqaText>
      </Pressable>

      {open ? (
        <BottomSingleCalendar
          currentDate={current}
          selectedDate={selectedDate}
          setSelected={setSelectedDate}
          onChangeDDuDuDate={onChangeDate}
          handleCalendarSheetToggleOff={() => setOpen(false)}
          minDate={minDate}
          maxDate={maxDate}
        />
      ) : null}
    </View>
  );
}

export default InputDateSingle;
