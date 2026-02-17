import { Platform, View } from "react-native";

import { SpoqaText, WheelPicker } from "@/components";

export type TimePickerType = "day" | "hour" | "min";

export interface TimePickerProps {
  type: TimePickerType;
  value?: number;
  onChange: (next: number) => void;
  width?: number;
  itemHeight?: number;
  label?: string;
  days?: number;
}

function TimePicker({
  type,
  value = 0,
  onChange,
  width = Platform.OS === "web" ? 72 : 50,
  itemHeight = 40,
  label,
  days = 99,
}: TimePickerProps) {
  const data: number[] = (() => {
    const length = type === "hour" ? 24 : type === "min" ? 60 : days;

    return Array.from({ length: length }, (_, i) => i);
  })();

  const unitLabel = label ?? (type === "day" ? "일" : type === "hour" ? "시" : "분");

  const handleChange = (index: number) => {
    onChange(index);
  };

  return (
    <View className="flex-row items-center">
      <View
        className="items-center justify-center rounded-radius10 bg-example_gray_100"
        style={{ width, height: itemHeight * 3 }}
      >
        <WheelPicker
          data={data}
          value={value}
          onChange={handleChange}
          itemHeight={itemHeight}
          width={width}
        />
      </View>
      <SpoqaText className="px-[0.5rem]">{unitLabel}</SpoqaText>
    </View>
  );
}

export default TimePicker;
