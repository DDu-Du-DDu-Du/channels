interface UseFeedCalendarDayContentProps {
  date: string;
  disabled?: boolean;
  selectedDate?: string;
  onPress?: (date: string) => void;
}

function useFeedCalendarDayContent({
  date,
  disabled = false,
  selectedDate,
  onPress,
}: UseFeedCalendarDayContentProps) {
  const isSelected = selectedDate === date;

  const handlePressDate = () => {
    if (disabled) {
      return;
    }

    onPress?.(date);
  };

  return { isSelected, handlePressDate };
}

export default useFeedCalendarDayContent;
