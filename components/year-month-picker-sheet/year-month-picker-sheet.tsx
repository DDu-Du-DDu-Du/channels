import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import FormHeader from "@/components/form-header/form-header";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import YearMonthPicker, { YearMonthValue } from "@/components/year-month-picker/year-month-picker";
import { useBottomSheetAction } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";

interface YearMonthPickerSheetProps {
  open: boolean;
  isRangeEnabled: boolean;
  singleValue: YearMonthValue;
  fromValue: YearMonthValue;
  toValue: YearMonthValue;
  onChangeSingle: (next: YearMonthValue) => void;
  onChangeFrom: (next: YearMonthValue) => void;
  onChangeTo: (next: YearMonthValue) => void;
  onClose: () => void;
}

const toYearMonthKey = (value: YearMonthValue) => value.year * 100 + value.month;

function YearMonthPickerSheet({
  open,
  isRangeEnabled,
  singleValue,
  fromValue,
  toValue,
  onChangeSingle,
  onChangeFrom,
  onChangeTo,
  onClose,
}: YearMonthPickerSheetProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();
  const iconStroke = useThemeColorToken("role.icon.default");
  const [toValidationMessage, setToValidationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setToValidationMessage(null);
      openSheet();
      return;
    }

    closeSheet();
  }, [closeSheet, open, openSheet]);

  useEffect(() => {
    if (!isRangeEnabled || toYearMonthKey(toValue) >= toYearMonthKey(fromValue)) {
      setToValidationMessage(null);
    }
  }, [fromValue, isRangeEnabled, toValue]);

  const handlePressConfirm = () => {
    closeSheet();
    onClose();
  };

  const handlePressBack = () => {
    closeSheet();
    onClose();
  };

  const handleChangeToWithValidation = (next: YearMonthValue) => {
    if (!isRangeEnabled) {
      setToValidationMessage(null);
      onChangeTo(next);
      return;
    }

    if (toYearMonthKey(next) < toYearMonthKey(fromValue)) {
      setToValidationMessage("종료 월은 시작 월보다 빠를 수 없어요.");
      return;
    }

    setToValidationMessage(null);
    onChangeTo(next);
  };

  return (
    <BottomSheet
      ref={ref}
      fitContent
      onClose={onClose}
    >
      <View className="w-full px-[2.4rem] pb-[2.4rem] pt-[1.2rem]">
        <FormHeader
          title="월 선택"
          onPressBack={handlePressBack}
          iconStroke={iconStroke}
          titleClassName="text-size16 text-role-text-primary dark:text-role-dark-text-primary"
          className="px-0 pb-[0.6rem] pt-0"
        />

        <View className="mb-[5rem] mt-[4rem]">
          <YearMonthPicker
            isRangeEnabled={isRangeEnabled}
            singleValue={singleValue}
            fromValue={fromValue}
            toValue={toValue}
            toWarningText={toValidationMessage ?? undefined}
            onChangeSingle={onChangeSingle}
            onChangeFrom={onChangeFrom}
            onChangeTo={handleChangeToWithValidation}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          className="h-[5rem] items-center justify-center rounded-radius15 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg"
          onPress={handlePressConfirm}
        >
          <SpoqaText
            weight="semiBold"
            className="text-size15 text-role-text-inverse dark:text-role-dark-text-inverse"
          >
            확인
          </SpoqaText>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

export type { YearMonthPickerSheetProps };
export default YearMonthPickerSheet;
