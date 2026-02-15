import { View } from "react-native";

import { Button } from "@/components";

export interface ButtonViewProps {
  label?: string;
  onPress?: () => void;
}

function ButtonView({ label = "목표 등록", onPress }: ButtonViewProps) {
  return (
    <View className="flex-1 items-center justify-center bg-main px-[2.4rem]">
      <View className="w-full">
        <Button
          label={label}
          onPress={onPress ?? (() => {})}
        />
      </View>
    </View>
  );
}

export default ButtonView;
