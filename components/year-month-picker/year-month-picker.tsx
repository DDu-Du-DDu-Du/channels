import { Platform, View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";
import WheelPicker from "@/components/wheel-picker/wheel-picker";

export interface YearMonthValue {
  year: number;
  month: number;
}

interface YearMonthPickerProps {
  isRangeEnabled: boolean;
  singleValue: YearMonthValue;
  fromValue: YearMonthValue;
  toValue: YearMonthValue;
  toWarningText?: string;
  onChangeSingle: (next: YearMonthValue) => void;
  onChangeFrom: (next: YearMonthValue) => void;
  onChangeTo: (next: YearMonthValue) => void;
  minYear?: number;
  maxYear?: number;
}

const toYearIndex = (year: number, minYear: number) => year - minYear;
const toMonthIndex = (month: number) => month - 1;

const getPickerWidth = () => (Platform.OS === "web" ? 76 : 58);

function YearMonthPicker({
  isRangeEnabled,
  singleValue,
  fromValue,
  toValue,
  toWarningText,
  onChangeSingle,
  onChangeFrom,
  onChangeTo,
  minYear = 1980,
  maxYear = 2099,
}: YearMonthPickerProps) {
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, index) => minYear + index);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);

  const handleChangeYear = (type: "single" | "from" | "to", index: number) => {
    const year = years[index] ?? minYear;

    if (type === "single") {
      onChangeSingle({ ...singleValue, year });
      return;
    }

    if (type === "from") {
      onChangeFrom({ ...fromValue, year });
      return;
    }

    onChangeTo({ ...toValue, year });
  };

  const handleChangeMonth = (type: "single" | "from" | "to", index: number) => {
    const month = months[index] ?? 1;

    if (type === "single") {
      onChangeSingle({ ...singleValue, month });
      return;
    }

    if (type === "from") {
      onChangeFrom({ ...fromValue, month });
      return;
    }

    onChangeTo({ ...toValue, month });
  };

  const renderPickerLine = (label: string | null, type: "single" | "from" | "to") => {
    const value = type === "single" ? singleValue : type === "from" ? fromValue : toValue;

    return (
      <View className="w-full">
        {label ? (
          <SpoqaText
            weight="semiBold"
            className="mb-[0.8rem] text-size13 text-role-text-primary dark:text-role-dark-text-primary"
          >
            {label}
          </SpoqaText>
        ) : null}
        <View className="flex-row items-center justify-center gap-[0.8rem]">
          <View className="items-center rounded-radius10 bg-role-surface-panel dark:bg-role-dark-surface-panel px-[0.6rem] py-[0.4rem]">
            <WheelPicker
              data={years}
              value={toYearIndex(value.year, minYear)}
              onChange={(index) => handleChangeYear(type, index)}
              itemHeight={40}
              width={getPickerWidth()}
            />
          </View>
          <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
            년
          </SpoqaText>
          <View className="items-center rounded-radius10 bg-role-surface-panel dark:bg-role-dark-surface-panel px-[0.6rem] py-[0.4rem]">
            <WheelPicker
              data={months}
              value={toMonthIndex(value.month)}
              onChange={(index) => handleChangeMonth(type, index)}
              itemHeight={40}
              width={getPickerWidth()}
            />
          </View>
          <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
            월
          </SpoqaText>
        </View>
        {type === "to" && toWarningText ? (
          <SpoqaText className="mt-[0.6rem] text-size12 text-role-status-error dark:text-role-dark-status-error">
            {toWarningText}
          </SpoqaText>
        ) : null}
      </View>
    );
  };

  return (
    <View className="w-full gap-[1.8rem]">
      {isRangeEnabled ? (
        <>
          {renderPickerLine("from", "from")}
          {renderPickerLine("to", "to")}
        </>
      ) : (
        renderPickerLine(null, "single")
      )}
    </View>
  );
}

export type { YearMonthPickerProps };
export default YearMonthPicker;
