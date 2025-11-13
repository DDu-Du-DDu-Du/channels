import { View } from "react-native";

import { SelectOption } from "@/components";

export interface SelectOptionViewProps {
  children?: string;
  backgroundColor?: string;
  width?: string;
}

function SelectOptionView({
  children = "옵션을 선택하세요",
  backgroundColor = "#F5F5F5",
  width,
}: SelectOptionViewProps) {
  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <SelectOption
        backgroundColor={backgroundColor}
        width={width}
        onPress={() => {}}
      >
        {children}
      </SelectOption>
    </View>
  );
}

export default SelectOptionView;
