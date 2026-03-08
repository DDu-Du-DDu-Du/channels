import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

import { BottomSheet, SpoqaText } from "@/components";
import { useBottomSheetAction, useCalendarFirstDay } from "@/hooks";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "@/icons";
import { formatDateToYYYYMMDD, getWeekendHeaderTheme } from "@/utils";

export interface BottomSingleCalendarProps {
  currentDate: string;
  selectedDate: Date | undefined;
  setSelected: (date: Date | undefined) => void;
  onChangeDDuDuDate: (selectedDate: Date) => void;
  handleCalendarSheetToggleOff: () => void;
  minDate?: string;
  maxDate?: string;
  hideExtraDays?: boolean;
  showSixWeeks?: boolean;
  showBackArrow?: boolean;
  onPressBack?: () => void;
  confirmButtonLabel?: string;
}

function BottomSingleCalendar({
  currentDate,
  selectedDate,
  setSelected,
  onChangeDDuDuDate,
  handleCalendarSheetToggleOff,
  minDate,
  maxDate,
  hideExtraDays = false,
  showSixWeeks = false,
  showBackArrow = false,
  onPressBack,
  confirmButtonLabel,
}: BottomSingleCalendarProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();
  const firstDay = useCalendarFirstDay();

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
              <View
                className="h-[2.8rem] w-[2.8rem] items-center justify-center rounded-full"
                style={{ backgroundColor: "#E5E7EB" }}
              >
                <ChevronLeftIcon
                  size={14}
                  fill="#4B5563"
                />
              </View>
            ) : (
              <View
                className="h-[2.8rem] w-[2.8rem] items-center justify-center rounded-full"
                style={{ backgroundColor: "#E5E7EB" }}
              >
                <ChevronRightIcon
                  size={14}
                  fill="#4B5563"
                />
              </View>
            )
          }
          renderHeader={(date) => (
            <SpoqaText className="text-size15">{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</SpoqaText>
          )}
          hideExtraDays={hideExtraDays}
          showSixWeeks={showSixWeeks}
          theme={{ textSectionTitleColor: "#000", ...getWeekendHeaderTheme(firstDay) }}
          firstDay={firstDay}
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
            {confirmButtonLabel ?? "확인"}
          </SpoqaText>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

export default BottomSingleCalendar;
