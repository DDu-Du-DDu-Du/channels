import { useMemo, useState } from "react";
import { View } from "react-native";

import { SpoqaText, WheelPicker } from "@/components";

export interface WheelPickerViewProps {
  data?: (string | number)[];
  value?: number;
  itemHeight?: number;
  visibleCount?: number;
  onChange?: (index: number) => void;
}

function WheelPickerView({
  data,
  value = 0,
  itemHeight,
  visibleCount,
  onChange,
}: WheelPickerViewProps) {
  const defaultData = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const list = data ?? defaultData;
  const [index, setIndex] = useState(value);

  const handleChange = (i: number) => {
    setIndex(i);
    onChange?.(i);
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <WheelPicker
        data={list}
        value={index}
        onChange={handleChange}
        itemHeight={itemHeight}
        visibleCount={visibleCount}
      />
      <SpoqaText className="mt-4 text-size13">Selected: {String(list[index])}</SpoqaText>
    </View>
  );
}

export default WheelPickerView;
