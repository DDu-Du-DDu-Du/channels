import { useState } from "react";

import { useToggle } from "@/hooks";
import { formatDateToYYYYMMDD } from "@/utils";

export interface UseDateChangeProps {
  label: string;
  onChange?: (next: string) => void;
}

function useDateChange({ label, onChange }: UseDateChangeProps) {
  const { isToggle, handleToggleOn, handleToggleOff } = useToggle();
  const [selectedDate, setSelectedDate] = useState(
    isNaN(Date.parse(label)) ? undefined : new Date(label),
  );

  const handleChangeDate = (date: Date) => {
    const next = formatDateToYYYYMMDD(date);

    onChange?.(next);
    handleToggleOff();
  };

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  return {
    selectedDate,
    isToggle,
    handleToggleOn,
    handleToggleOff,
    handleSelectDate,
    handleChangeDate,
  };
}

export default useDateChange;
