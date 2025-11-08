import { Controller, useFormContext } from "react-hook-form";

import useDateChange from "../../hooks/use-date-change/use-date-change";
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
  const { date, handleSelect } = useDateChange({ label, onMinDateChange, onMaxDateChange });

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field: { value } }) => (
        <InputDateSingle
          label={date}
          value={value}
          onChange={handleSelect}
          todayDate={todayDate}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}
    />
  );
}

export default InputDateSingleController;
