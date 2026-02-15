import { useState } from "react";

interface UseDDuDuDateProps {
  handleCalendarSheetToggleOn: () => void;
  handleDDuDuSheetToggleOff: () => void;
}

const useDDuDuDate = ({
  handleCalendarSheetToggleOn,
  handleDDuDuSheetToggleOff,
}: UseDDuDuDateProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [currentDate, setCurrentDate] = useState("");
  const [currentCalendarType, setCurrentCalendarType] = useState<"repeat" | "change">("change");

  const handleSelectedDate = (nextDate: Date | undefined) => {
    setSelectedDate(nextDate);
  };

  const handleSelectDifferentDate = (type: "change" | "repeat", date: string) => {
    setCurrentCalendarType(type);
    setCurrentDate(date);
    handleCalendarSheetToggleOn();
    handleDDuDuSheetToggleOff();
  };

  return {
    selectedDate,
    currentDate,
    currentCalendarType,
    handleSelectedDate,
    handleSelectDifferentDate,
  };
};

export default useDDuDuDate;
