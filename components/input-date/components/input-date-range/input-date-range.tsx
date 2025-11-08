import { useState } from "react";

import InputDateSingleController from "../input-date-single-controller/input-date-single-controller";

export interface InputDateRangeProps {
  mode: "create" | "edit";
  todayDate: string;
  labelStart: string;
  nameStart: string;
  labelEnd: string;
  nameEnd: string;
}

function InputDateRange({
  mode,
  todayDate,
  labelStart,
  nameStart,
  labelEnd,
  nameEnd,
}: InputDateRangeProps) {
  const [minDate, setMinDate] = useState<string>(todayDate);
  const [maxDate, setMaxDate] = useState<string>("");

  const startMin = mode === "create" ? undefined : undefined;
  const startMax = mode === "create" ? maxDate || undefined : undefined;
  const endMin = mode === "create" ? minDate || undefined : undefined;

  return (
    <>
      <InputDateSingleController
        label={labelStart}
        name={nameStart}
        todayDate={mode === "create" ? todayDate : undefined}
        minDate={startMin}
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

export default InputDateRange;
