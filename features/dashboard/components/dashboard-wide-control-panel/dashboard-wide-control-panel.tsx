import { useMemo } from "react";
import { Pressable, View } from "react-native";
import type { DateData } from "react-native-calendars";
import type { MarkedDates } from "react-native-calendars/src/types";

import { CustomCalendar, SpoqaText } from "@/components";
import type { TodoDashboardContentType } from "@/types/response/todo/todo";

import type { DashboardStatusFilterType } from "../../hooks";

interface DashboardWideControlPanelProps {
  selectedStatus: DashboardStatusFilterType;
  selectedDate: string;
  visibleSections: TodoDashboardContentType[];
  onSelectStatus: (status: DashboardStatusFilterType) => void;
  onSelectDate: (date: string) => void;
}

const STATUS_OPTIONS: { label: string; value: DashboardStatusFilterType }[] = [
  { label: "All", value: "ALL" },
  { label: "Complete", value: "COMPLETE" },
  { label: "Incomplete", value: "UNCOMPLETED" },
];

function DashboardWideControlPanel({
  selectedStatus,
  selectedDate,
  visibleSections,
  onSelectStatus,
  onSelectDate,
}: DashboardWideControlPanelProps) {
  const markedDates = useMemo<MarkedDates>(() => {
    const nextMarkedDates = visibleSections.reduce<MarkedDates>((acc, section) => {
      if (section.todos.length > 0) {
        acc[section.date] = { marked: true };
      }

      return acc;
    }, {});

    nextMarkedDates[selectedDate] = {
      ...(nextMarkedDates[selectedDate] ?? {}),
      selected: true,
    };

    return nextMarkedDates;
  }, [selectedDate, visibleSections]);

  const handleDayPress = (day: DateData) => {
    onSelectDate(day.dateString);
  };

  return (
    <View className="h-full w-full bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <View className="h-[5.6rem] flex-row items-center border-b border-role-border-subtle px-[1.8rem] dark:border-role-dark-border-subtle">
        <View className="min-w-0 flex-1 flex-row flex-wrap gap-[0.8rem]">
          {STATUS_OPTIONS.map((option) => {
            const isSelected = selectedStatus === option.value;

            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                onPress={() => onSelectStatus(option.value)}
                className={`h-[3.4rem] items-center justify-center rounded-circle px-[1.2rem] ${
                  isSelected
                    ? "bg-[#E9E9E9] dark:bg-role-dark-surface-canvas"
                    : "border border-role-border-subtle bg-transparent dark:border-role-dark-border-subtle"
                }`}
              >
                <SpoqaText
                  weight="medium"
                  className="text-size13 text-role-text-secondary dark:text-role-dark-text-secondary"
                  numberOfLines={1}
                >
                  {option.label}
                </SpoqaText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="px-[1.4rem] py-[1.6rem]">
        <CustomCalendar
          current={selectedDate}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          hideExtraDays
          showSixWeeks
        />
      </View>
    </View>
  );
}

export default DashboardWideControlPanel;
