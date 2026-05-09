import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { SelectChip } from "@/components";
import type { DayOfWeek } from "@/types/response/repeat-todo/repeat-todo";

import RepeatTypePicker, { RepeatTypeValue } from "../repeat-type-picker/repeat-type-picker";

const WEEK_DAYS: { label: string; value: DayOfWeek }[] = [
  { label: "월", value: "MONDAY" },
  { label: "화", value: "TUESDAY" },
  { label: "수", value: "WEDNESDAY" },
  { label: "목", value: "THURSDAY" },
  { label: "금", value: "FRIDAY" },
  { label: "토", value: "SATURDAY" },
  { label: "일", value: "SUNDAY" },
];

const MONTHLY_ROWS = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 31],
];

export interface RepeatTypeSelectProps {
  repeatType: RepeatTypeValue;
  onChangeRepeatType: (nextType: RepeatTypeValue) => void;
  selectedWeekDays: DayOfWeek[];
  onToggleWeekDay: (day: DayOfWeek) => void;
  selectedMonthDays: number[];
  onToggleMonthDay: (day: number) => void;
  isLastDaySelected: boolean;
  onToggleLastDay: () => void;
}

function RepeatTypeSelect({
  repeatType,
  onChangeRepeatType,
  selectedWeekDays,
  onToggleWeekDay,
  selectedMonthDays,
  onToggleMonthDay,
  isLastDaySelected,
  onToggleLastDay,
}: RepeatTypeSelectProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-[1.2rem]">
      <RepeatTypePicker
        value={repeatType}
        onChange={onChangeRepeatType}
      />

      {repeatType === "WEEKLY" && (
        <View className="flex-row flex-wrap justify-center gap-[0.6rem]">
          {WEEK_DAYS.map((day) => (
            <SelectChip
              key={day.value}
              label={day.label}
              selected={selectedWeekDays.includes(day.value)}
              onPress={() => onToggleWeekDay(day.value)}
              className="h-[3.8rem] w-[4.6rem]"
            />
          ))}
        </View>
      )}

      {repeatType === "MONTHLY" && (
        <View className="gap-[0.6rem] rounded-radius15 border border-role-border-strong dark:border-role-dark-border-strong bg-role-surface-canvas dark:bg-role-dark-surface-canvas p-[0.8rem]">
          {MONTHLY_ROWS.map((row, rowIndex) => (
            <View
              key={`month-row-${rowIndex}`}
              className="flex-row flex-wrap justify-center gap-[0.6rem]"
            >
              {row.map((day) => (
                <SelectChip
                  key={`month-day-${day}`}
                  label={String(day)}
                  selected={selectedMonthDays.includes(day)}
                  onPress={() => onToggleMonthDay(day)}
                  className="h-[3.8rem] w-[4.2rem]"
                />
              ))}
              {rowIndex === 4 && (
                <SelectChip
                  label={t("repeatTodo.lastDay")}
                  selected={isLastDaySelected}
                  onPress={onToggleLastDay}
                  className="h-[3.8rem] w-[8.2rem]"
                />
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default RepeatTypeSelect;
