import { useState } from "react";

export interface UseDateChangeProps {
  label: string;
  onMinDateChange?: (date: string) => void;
  onMaxDateChange?: (date: string) => void;
}

function useDateChange({ label, onMinDateChange, onMaxDateChange }: UseDateChangeProps) {
  const [date, setDate] = useState<string>(label);

  const handleSelect = (next: string) => {
    setDate(next);
    onMinDateChange?.(next);
    onMaxDateChange?.(next);
  };

  return { date, handleSelect };
}

export default useDateChange;
