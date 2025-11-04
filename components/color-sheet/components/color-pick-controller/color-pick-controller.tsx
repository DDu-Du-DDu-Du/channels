import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";

import { ColorPickerInput } from "../index";

interface ColorPickControllerProps {
  list: string[];
  disabled?: boolean;
  onPick: (color: string) => void;
}

function ColorPickController({ list, disabled, onPick }: ColorPickControllerProps) {
  const { control } = useFormContext();

  const handlePress = (color: string, onChange: (...event: any[]) => void) => {
    if (disabled) {
      return;
    }

    onChange(color);
    onPick(color);
  };

  return (
    <Controller
      name="color"
      control={control}
      render={({ field: { value, onChange } }) => (
        <View className="w-full flex-row flex-wrap justify-center gap-[1rem]">
          {list.map((color) => (
            <ColorPickerInput
              key={color}
              color={color}
              isChecked={value === color}
              disabled={disabled}
              onPress={(color) => handlePress(color, onChange)}
            />
          ))}
        </View>
      )}
    />
  );
}

export default ColorPickController;
