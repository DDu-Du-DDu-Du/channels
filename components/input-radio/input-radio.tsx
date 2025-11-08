import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";

import { RadioItem } from "./components";

export interface InputRadioOption {
  id: string;
  label: string;
}

export interface InputRadioProps {
  name: string;
  options: InputRadioOption[];
  disabled?: boolean;
  className?: string;
  onChange?: (id: string) => void;
}

function InputRadio({ name, options, disabled, className, onChange }: InputRadioProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field: { value, onChange: rhfOnChange } }) => (
        <View
          accessibilityRole="radiogroup"
          className={`flex-row flex-wrap gap-[0.8rem] ${className ?? ""}`}
        >
          {options.map(({ id, label }) => (
            <RadioItem
              key={id}
              id={id}
              label={label}
              selected={value === id}
              disabled={disabled}
              onPress={() => {
                rhfOnChange(id);
                onChange?.(id);
              }}
            />
          ))}
        </View>
      )}
    />
  );
}

export default InputRadio;
