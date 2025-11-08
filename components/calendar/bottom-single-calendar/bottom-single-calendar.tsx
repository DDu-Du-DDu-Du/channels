import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

import { BottomSheet, SpoqaText } from "@/components";
import { useBottomSheetAction } from "@/hooks";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";
import { formatDateToYYYYMMDD } from "@/utils";

export interface BottomSingleCalendarProps {
  currentDate: string;
  selectedDate: Date | undefined;
  setSelected: (date: Date | undefined) => void;
  onChangeDDuDuDate: (selectedDate: Date) => void;
  handleCalendarSheetToggleOff: () => void;
}

function BottomSingleCalendar({
  currentDate,
  selectedDate,
  setSelected,
  onChangeDDuDuDate,
  handleCalendarSheetToggleOff,
}: BottomSingleCalendarProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  const selectedString = selectedDate ? formatDateToYYYYMMDD(selectedDate) : undefined;
  const markedDates = selectedString ? { [selectedString]: { selected: true } } : undefined;
  console.log(selectedString);

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

  return (
    <BottomSheet
      ref={ref}
      onClose={handleCalendarSheetToggleOff}
      fitContent
    >
      <View className="w-full pb-[1.5rem] px-[2.4rem]">
        <Calendar
          current={selectedString}
          markedDates={markedDates}
          onDayPress={handleDayPress}
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
            <SpoqaText className="text-size15">
              {`${date.getFullYear()}년 ${date.getMonth() + 1}월`}
            </SpoqaText>
          )}
          hideExtraDays={false}
          firstDay={0}
        />
      </View>
      <View className="px-[2.4rem]">
        <Pressable
          accessibilityRole="button"
          className="w-[100%] max-w-[50rem] h-[5.6rem] bg-main rounded-radius15 mb-[2rem] items-center justify-center"
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
