import { useState } from "react";

interface UseTodoDateProps {
  handleCalendarSheetToggleOn: () => void;
  handleTodosheetToggleOff: () => void;
}

const useTodoDate = ({
  handleCalendarSheetToggleOn,
  handleTodosheetToggleOff,
}: UseTodoDateProps) => {
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
    handleTodosheetToggleOff();
  };

  return {
    selectedDate,
    currentDate,
    currentCalendarType,
    handleSelectedDate,
    handleSelectDifferentDate,
  };
};

export default useTodoDate;
