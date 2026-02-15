import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { Theme } from "react-native-calendars/src/types";

import { BottomSheet, SpoqaText } from "@/components";
import { useBottomSheetAction } from "@/hooks";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "@/icons";
import { formatDateToYYYYMMDD } from "@/utils";

export interface BottomSingleCalendarProps {
  currentDate: string;
  selectedDate: Date | undefined;
  setSelected: (date: Date | undefined) => void;
  onChangeDDuDuDate: (selectedDate: Date) => void;
  handleCalendarSheetToggleOff: () => void;
  minDate?: string;
  maxDate?: string;
  showBackArrow?: boolean;
  onPressBack?: () => void;
}

function BottomSingleCalendar({
  currentDate,
  selectedDate,
  setSelected,
  onChangeDDuDuDate,
  handleCalendarSheetToggleOff,
  minDate,
  maxDate,
  showBackArrow = false,
  onPressBack,
}: BottomSingleCalendarProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  const selectedString = selectedDate ? formatDateToYYYYMMDD(selectedDate) : undefined;
  const markedDates = selectedString ? { [selectedString]: { selected: true } } : undefined;

  const handleDayPress = (day: DateData) => {
    const next = new Date(day.dateString);

    setSelected(next);
  };

  const handleConfirm = () => {
    if (!selectedDate || currentDate === formatDateToYYYYMMDD(selectedDate)) {
      closeSheet();
      handleCalendarSheetToggleOff();
      return;
    }

    onChangeDDuDuDate(selectedDate);
  };

  const handlePressBack = () => {
    closeSheet();
    onPressBack?.();
    handleCalendarSheetToggleOff();
  };

  return (
    <BottomSheet
      ref={ref}
      onClose={handleCalendarSheetToggleOff}
      fitContent
    >
      {showBackArrow && (
        <View className="w-full px-[2.4rem] pt-[1.2rem]">
          <Pressable
            onPress={handlePressBack}
            className="size-[2.4rem] items-start justify-center"
            hitSlop={8}
          >
            <ArrowLeftIcon
              size={16}
              stroke="#000000"
            />
          </Pressable>
        </View>
      )}
      <View className="w-full px-[2.4rem] pb-[1.5rem]">
        <Calendar
          current={selectedString || currentDate}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          minDate={minDate}
          maxDate={maxDate}
          monthFormat="yyyy년 MM월"
          renderArrow={(direction) =>
            direction === "left" ? (
              <ChevronLeftIcon
                size={20}
                fill="#000"
              />
            ) : (
              <ChevronRightIcon
                size={20}
                fill="#000"
              />
            )
          }
          renderHeader={(date) => (
            <SpoqaText className="text-size15">{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</SpoqaText>
          )}
          hideExtraDays={false}
          theme={
            {
              textSectionTitleColor: "#000",
              "stylesheet.calendar.header": {
                dayTextAtIndex0: {
                  color: "red",
                },
                dayTextAtIndex6: {
                  color: "blue",
                },
              },
            } as Theme
          }
          firstDay={0}
        />
      </View>
      <View className="px-[2.4rem]">
        <Pressable
          accessibilityRole="button"
          className="mb-[2rem] h-[5.6rem] w-[100%] max-w-[50rem] items-center justify-center rounded-radius15 bg-main"
          onPress={handleConfirm}
        >
          <SpoqaText
            weight="semiBold"
            className="text-white"
          >
            확인
          </SpoqaText>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

export default BottomSingleCalendar;
