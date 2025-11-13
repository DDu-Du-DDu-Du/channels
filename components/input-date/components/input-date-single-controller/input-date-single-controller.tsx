import { Controller, useFormContext } from "react-hook-form";

import InputDateSingle from "../input-date-single/input-date-single";

export interface InputDateSingleControllerProps {
  label: string;
  name: string;
  todayDate?: string;
  minDate?: string;
  maxDate?: string;
  onMinDateChange?: (data: string) => void;
  onMaxDateChange?: (data: string) => void;
}

function InputDateSingleController({
  label,
  name,
  todayDate,
  minDate,
  maxDate,
  onMinDateChange,
  onMaxDateChange,
}: InputDateSingleControllerProps) {
  const { control } = useFormContext();

  const handleSelect = (next: string, onChange: (...event: any[]) => void) => {
    onChange(next);
    onMinDateChange?.(next);
    onMaxDateChange?.(next);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      defaultValue={label}
      render={({ field: { value, onChange } }) => (
        <InputDateSingle
          label={value}
          onChange={(next) => handleSelect(next, onChange)}
          todayDate={todayDate}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}
    />
  );
}

export default InputDateSingleController;
