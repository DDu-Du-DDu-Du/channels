import { FEED_KEY } from "@/constants/query-key/query-key";
import { fetchDDuDuChangeDate, fetchDDuDuRepeatDate } from "@/service/feed/feed";
import { formatDateToYYYYMMDD } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseDDuDuDateMutationProps {
  currentDDuDuId: number;
  currentCalendarType: "change" | "repeat";
  handleSelectedDate: (selectedDate: Date | undefined) => void;
  handleCalendarSheetToggleOff: () => void;
  handleDDuDuSheetToggleOff: () => void;
}

const useDDuDuDateMutation = ({
  currentDDuDuId,
  currentCalendarType,
  handleSelectedDate,
  handleCalendarSheetToggleOff,
  handleDDuDuSheetToggleOff,
}: UseDDuDuDateMutationProps) => {
  const queryClient = useQueryClient();

  const handleSuccessDate = () => {
    queryClient.invalidateQueries({
      queryKey: [FEED_KEY.DAILY_LIST],
    });
    queryClient.refetchQueries({
      queryKey: [FEED_KEY.DAILY_LIST],
    });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.MONTHLY_DDUDUS] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.WEEKLY_DDUDUS] });

    handleSelectedDate(undefined);
    handleCalendarSheetToggleOff();
  };

  const dduduChangeDateMutation = useMutation({
    mutationKey: [FEED_KEY.DDUDU_CHANGE_DATE],
    mutationFn: fetchDDuDuChangeDate,
    onSuccess: handleSuccessDate,
  });

  const dduduRepeatDateMutation = useMutation({
    mutationKey: [FEED_KEY.DDUDU_REPEAT_DATE],
    mutationFn: fetchDDuDuRepeatDate,
    onSuccess: () => {
      handleSuccessDate();
      handleDDuDuSheetToggleOff();
    },
  });

  const onChangeDDuDuDate = (selectedDate: Date) => {
    const date = formatDateToYYYYMMDD(selectedDate);

    if (currentCalendarType === "change") {
      dduduChangeDateMutation.mutate({
        id: currentDDuDuId,
        date,
      });
    } else if (currentCalendarType === "repeat") {
      dduduRepeatDateMutation.mutate({
        id: currentDDuDuId,
        date,
      });
    }
  };

  const onRepeatCurrentDate = () => {
    dduduRepeatDateMutation.mutate({
      id: currentDDuDuId,
      date: formatDateToYYYYMMDD(new Date()),
    });
  };

  const onChangeCurrentDate = () => {
    dduduChangeDateMutation.mutate(
      {
        id: currentDDuDuId,
        date: formatDateToYYYYMMDD(new Date()),
      },
      {
        onSuccess: () => {
          handleSuccessDate();
          handleDDuDuSheetToggleOff();
        },
      },
    );
  };

  return {
    onChangeDDuDuDate,
    onRepeatCurrentDate,
    onChangeCurrentDate,
  };
};

export default useDDuDuDateMutation;
