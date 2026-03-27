import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import BottomSingleCalendar from "@/components/calendar/bottom-single-calendar/bottom-single-calendar";

import useDateChange from "../../hooks/use-date-change/use-date-change";

export interface InputDateSingleProps {
  label: string;
  onChange?: (yyyyMmDd: string) => void;
  todayDate?: string;
  minDate?: string;
  maxDate?: string;
}

function InputDateSingle({ label, onChange, todayDate, minDate, maxDate }: InputDateSingleProps) {
  const {
    isToggle,
    selectedDate,
    handleSelectDate,
    handleToggleOn,
    handleToggleOff,
    handleChangeDate,
  } = useDateChange({ label, onChange });
  const current = todayDate ?? new Date().toISOString().slice(0, 10);

  return (
    <View className="relative w-[12rem]">
      <Pressable
        accessibilityRole="button"
        className="h-[4rem] rounded-radius10 bg-role-surface-panel dark:bg-role-dark-surface-panel justify-center pl-[1.8rem]"
        onPress={handleToggleOn}
      >
        <SpoqaText className="text-size13">{label}</SpoqaText>
      </Pressable>

      {isToggle && (
        <BottomSingleCalendar
          currentDate={current}
          selectedDate={selectedDate}
          setSelected={handleSelectDate}
          onChangeTodoDate={handleChangeDate}
          handleCalendarSheetToggleOff={handleToggleOff}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}
    </View>
  );
}

export default InputDateSingle;
