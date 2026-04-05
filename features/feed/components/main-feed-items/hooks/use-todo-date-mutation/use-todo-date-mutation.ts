import { FEED_KEY } from "@/constants/query-key/query-key";
import { fetchTodoChangeDate, fetchTodoRepeatDate } from "@/service/feed/feed";
import { formatDateToYYYYMMDD } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseTodoDateMutationProps {
  currentTodoId: number;
  currentCalendarType: "change" | "repeat";
  handleSelectedDate: (selectedDate: Date | undefined) => void;
  handleCalendarSheetToggleOff: () => void;
  handleTodosheetToggleOff: () => void;
}

const useTodoDateMutation = ({
  currentTodoId,
  currentCalendarType,
  handleSelectedDate,
  handleCalendarSheetToggleOff,
  handleTodosheetToggleOff,
}: UseTodoDateMutationProps) => {
  const queryClient = useQueryClient();

  const handleSuccessDate = () => {
    queryClient.invalidateQueries({
      queryKey: [FEED_KEY.DAILY_LIST],
    });
    queryClient.refetchQueries({
      queryKey: [FEED_KEY.DAILY_LIST],
    });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.MONTHLY_Todos] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.WEEKLY_Todos] });

    handleSelectedDate(undefined);
    handleCalendarSheetToggleOff();
  };

  const TodoChangeDateMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_CHANGE_DATE],
    mutationFn: fetchTodoChangeDate,
    onSuccess: handleSuccessDate,
  });

  const TodoRepeatDateMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_REPEAT_DATE],
    mutationFn: fetchTodoRepeatDate,
    onSuccess: () => {
      handleSuccessDate();
      handleTodosheetToggleOff();
    },
  });

  const onChangeTodoDate = (selectedDate: Date) => {
    if (TodoChangeDateMutation.isPending || TodoRepeatDateMutation.isPending) {
      return;
    }

    const date = formatDateToYYYYMMDD(selectedDate);

    if (currentCalendarType === "change") {
      TodoChangeDateMutation.mutate({
        id: currentTodoId,
        date,
      });
    } else if (currentCalendarType === "repeat") {
      TodoRepeatDateMutation.mutate({
        id: currentTodoId,
        date,
      });
    }
  };

  const onRepeatCurrentDate = () => {
    if (TodoRepeatDateMutation.isPending || TodoChangeDateMutation.isPending) {
      return;
    }

    TodoRepeatDateMutation.mutate({
      id: currentTodoId,
      date: formatDateToYYYYMMDD(new Date()),
    });
  };

  const onChangeCurrentDate = () => {
    if (TodoChangeDateMutation.isPending || TodoRepeatDateMutation.isPending) {
      return;
    }

    TodoChangeDateMutation.mutate(
      {
        id: currentTodoId,
        date: formatDateToYYYYMMDD(new Date()),
      },
      {
        onSuccess: () => {
          handleSuccessDate();
          handleTodosheetToggleOff();
        },
      },
    );
  };

  return {
    onChangeTodoDate,
    onRepeatCurrentDate,
    onChangeCurrentDate,
    isChangeDatePending: TodoChangeDateMutation.isPending,
    isRepeatDatePending: TodoRepeatDateMutation.isPending,
  };
};

export default useTodoDateMutation;
