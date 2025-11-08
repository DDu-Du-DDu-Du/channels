import { useState } from "react";

import InputDateSingleController from "../input-date-single-controller/input-date-single-controller";

export interface InputDateRangeControllerProps {
  mode: "create" | "edit";
  todayDate: string;
  labelStart: string;
  nameStart: string;
  labelEnd: string;
  nameEnd: string;
}

function InputDateRangeController({
  mode,
  todayDate,
  labelStart,
  nameStart,
  labelEnd,
  nameEnd,
}: InputDateRangeControllerProps) {
  const [minDate, setMinDate] = useState<string>(todayDate);
  const [maxDate, setMaxDate] = useState<string>("");

  const startMax = mode === "create" ? maxDate || undefined : undefined;
  const endMin = mode === "create" ? minDate || undefined : undefined;

  return (
    <>
      <InputDateSingleController
        label={labelStart}
        name={nameStart}
        todayDate={mode === "create" ? todayDate : undefined}
        maxDate={startMax}
        onMinDateChange={(d) => setMinDate(d)}
      />
      <InputDateSingleController
        label={labelEnd}
        name={nameEnd}
        minDate={endMin}
        onMaxDateChange={(d) => setMaxDate(d)}
      />
    </>
  );
}

export default InputDateRangeController;
