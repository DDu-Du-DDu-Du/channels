import { useMemo } from "react";

import InputDateRangeController from "./components/input-date-range-controller/input-date-range-controller";
import InputDateSingleController from "./components/input-date-single-controller/input-date-single-controller";

export interface InputDateProps {
  type: "single" | "range";
  mode?: "create" | "edit";
  labelStart: string;
  nameStart: string;
  labelEnd?: string;
  nameEnd?: string;
}

function InputDate({
  type = "single",
  mode = "create",
  labelStart,
  nameStart,
  labelEnd,
  nameEnd,
}: InputDateProps) {
  const todayDate = useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }, []);

  return (
    <>
      {type === "single" && (
        <InputDateSingleController
          label={labelStart}
          name={nameStart}
          todayDate={todayDate}
        />
      )}
      {type === "range" && labelEnd && nameEnd && (
        <InputDateRangeController
          mode={mode}
          todayDate={todayDate}
          labelStart={labelStart}
          nameStart={nameStart}
          labelEnd={labelEnd}
          nameEnd={nameEnd}
        />
      )}
    </>
  );
}

export default InputDate;
