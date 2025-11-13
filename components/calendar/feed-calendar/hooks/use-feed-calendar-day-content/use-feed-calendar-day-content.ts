interface UseFeedCalendarDayContentProps {
  today: string;
  date: string;
  disabled?: boolean;
  selectedDate?: string;
  onPress: (date: string) => void;
}

function useFeedCalendarDayContent({
  today,
  date,
  disabled = false,
  selectedDate,
  onPress,
}: UseFeedCalendarDayContentProps) {
  const isToday = today === date;
  const isSelected = selectedDate === date || (!selectedDate && isToday);

  const handlePressDate = () => {
    if (disabled) {
      return;
    }

    onPress(date);
  };

  return { isSelected, handlePressDate };
}

export default useFeedCalendarDayContent;
