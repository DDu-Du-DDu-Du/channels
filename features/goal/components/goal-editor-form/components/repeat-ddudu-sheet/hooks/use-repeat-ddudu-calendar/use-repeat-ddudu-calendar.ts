import { useState } from "react";

function useRepeatDduduCalendar() {
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);

  const handleOpenStartCalendar = () => {
    setIsStartCalendarOpen(true);
  };

  const handleOpenEndCalendar = () => {
    setIsEndCalendarOpen(true);
  };

  const handleCloseStartCalendar = () => {
    setIsStartCalendarOpen(false);
  };

  const handleCloseEndCalendar = () => {
    setIsEndCalendarOpen(false);
  };

  const handleResetCalendar = () => {
    setIsStartCalendarOpen(false);
    setIsEndCalendarOpen(false);
  };

  return {
    isStartCalendarOpen,
    isEndCalendarOpen,
    handleOpenStartCalendar,
    handleOpenEndCalendar,
    handleCloseStartCalendar,
    handleCloseEndCalendar,
    handleResetCalendar,
  };
}

export default useRepeatDduduCalendar;
