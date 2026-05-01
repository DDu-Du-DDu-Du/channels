import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { DateData } from "react-native-calendars";

import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import CustomCalendar from "@/components/calendar/custom-calendar/custom-calendar";
import FormHeader from "@/components/form-header/form-header";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { useBottomSheetAction } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { formatDateToYYYYMMDD } from "@/utils";

export interface BottomSingleCalendarProps {
  currentDate: string;
  selectedDate: Date | undefined;
  setSelected: (date: Date | undefined) => void;
  onChangeTodoDate: (selectedDate: Date) => void;
  handleCalendarSheetToggleOff: () => void;
  minDate?: string;
  maxDate?: string;
  hideExtraDays?: boolean;
  showSixWeeks?: boolean;
  showBackArrow?: boolean;
  onPressBack?: () => void;
  confirmButtonLabel?: string;
  shouldConfirmSameDate?: boolean;
}

function BottomSingleCalendar({
  currentDate,
  selectedDate,
  setSelected,
  onChangeTodoDate,
  handleCalendarSheetToggleOff,
  minDate,
  maxDate,
  hideExtraDays = false,
  showSixWeeks = false,
  showBackArrow = false,
  onPressBack,
  confirmButtonLabel,
  shouldConfirmSameDate = false,
}: BottomSingleCalendarProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();
  const backIconStroke = useThemeColorToken("ui.icon.default");

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
    if (!selectedDate) {
      closeSheet();
      handleCalendarSheetToggleOff();
      return;
    }

    const nextSelectedDate = formatDateToYYYYMMDD(selectedDate);

    if (!shouldConfirmSameDate && currentDate === nextSelectedDate) {
      closeSheet();
      handleCalendarSheetToggleOff();
      return;
    }

    onChangeTodoDate(selectedDate);
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
      {showBackArrow && onPressBack ? (
        <FormHeader
          title=""
          onPressBack={handlePressBack}
          iconStroke={backIconStroke}
          titleClassName="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
          className="px-[2.4rem] pb-[0.2rem] pt-[1.2rem]"
        />
      ) : null}
      <View className="w-full px-[2.4rem] pb-[1.5rem]">
        <CustomCalendar
          current={selectedString || currentDate}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          minDate={minDate}
          maxDate={maxDate}
          hideExtraDays={hideExtraDays}
          showSixWeeks={showSixWeeks}
        />
      </View>
      <View className="px-[2.4rem]">
        <Pressable
          accessibilityRole="button"
          className="mb-[2rem] h-[5.6rem] w-[100%] max-w-[50rem] items-center justify-center rounded-radius15 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg"
          onPress={handleConfirm}
        >
          <SpoqaText
            weight="semiBold"
            className="text-role-text-inverse dark:text-role-dark-text-inverse"
          >
            {confirmButtonLabel ?? "확인"}
          </SpoqaText>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

export default BottomSingleCalendar;
