import { useState } from "react";

interface UseFeedCalendarProps {
  today: string;
  onSelectDate: (date: string) => void;
}

function useFeedCalendar({ today, onSelectDate }: UseFeedCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(today);

  const handleSelectDate = (date: string) => {
    onSelectDate(date);
    setSelectedDate(date);
  };

  return { selectedDate, handleSelectDate };
}

export default useFeedCalendar;
