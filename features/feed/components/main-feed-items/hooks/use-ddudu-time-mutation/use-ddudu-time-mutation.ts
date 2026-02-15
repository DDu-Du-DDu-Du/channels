import { FEED_KEY } from "@/constants/query-key/query-key";
import type { DDuDuTimeRangeType, DDuDuTimeType } from "@/features/feed/feed.types";
import { fetchDDuDuChangeTime } from "@/service/feed/feed";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseDDuDuTimeMutationProps {
  currentDDuDuTime: DDuDuTimeType;
  currentDDuDuId: number;
  selectedDDuDuDate: string;
  handleUpdateDDuDuTime: (dduduTime: DDuDuTimeType) => void;
  handleDDuDuTimeSheetToggleOff: () => void;
}

const useDDuDuTimeMutation = ({
  currentDDuDuTime,
  currentDDuDuId,
  selectedDDuDuDate,
  handleUpdateDDuDuTime,
  handleDDuDuTimeSheetToggleOff,
}: UseDDuDuTimeMutationProps) => {
  const queryClient = useQueryClient();

  const dduduChangeTimeMutation = useMutation({
    mutationKey: [FEED_KEY.DDUDU_CHANGE_TIME],
    mutationFn: fetchDDuDuChangeTime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.DDUDU_DETAIL] });
      queryClient.refetchQueries({ queryKey: [FEED_KEY.DDUDU_DETAIL] });
      queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE] });
      queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE, selectedDDuDuDate] });
      handleUpdateDDuDuTime({ beginAt: "", endAt: "" });
      handleDDuDuTimeSheetToggleOff();
    },
  });

  const onChangeDDuDuTime = (selectedTime: DDuDuTimeRangeType) => {
    const { beginHour, beginMin, endHour, endMin } = selectedTime;
    const time = {
      beginAt: `${beginHour < 10 ? `0${beginHour}` : beginHour}:${
        beginMin < 10 ? `0${beginMin}` : beginMin
      }:00`,
      endAt: `${endHour < 10 ? `0${endHour}` : endHour}:${endMin < 10 ? `0${endMin}` : endMin}:00`,
    };

    if (!currentDDuDuTime.beginAt || !currentDDuDuTime.endAt) {
      if (beginHour === 0 && beginMin === 0 && endHour === 0 && endMin === 0) {
        handleDDuDuTimeSheetToggleOff();
        return;
      }
    } else {
      const [currentBeginHour, currentBeginMin] = currentDDuDuTime.beginAt.split(":").map(Number);
      const [currentEndHour, currentEndMin] = currentDDuDuTime.endAt.split(":").map(Number);

      if (
        beginHour === currentBeginHour &&
        beginMin === currentBeginMin &&
        endHour === currentEndHour &&
        endMin === currentEndMin
      ) {
        handleDDuDuTimeSheetToggleOff();
        return;
      }
    }

    dduduChangeTimeMutation.mutate({
      time,
      id: currentDDuDuId,
    });
  };

  return {
    onChangeDDuDuTime,
  };
};

export default useDDuDuTimeMutation;
