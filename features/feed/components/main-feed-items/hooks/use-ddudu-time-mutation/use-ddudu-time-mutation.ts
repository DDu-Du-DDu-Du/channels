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
      handleUpdateDDuDuTime({ beginAt: null, endAt: null });
      handleDDuDuTimeSheetToggleOff();
    },
  });

  const onChangeDDuDuTime = (selectedTime: DDuDuTimeRangeType) => {
    const { beginHour, beginMin, endHour, endMin, isBeginTimeEnabled, isEndTimeEnabled } =
      selectedTime;

    if (!isBeginTimeEnabled) {
      if (currentDDuDuTime.beginAt === null && currentDDuDuTime.endAt === null) {
        handleDDuDuTimeSheetToggleOff();
        return;
      }

      dduduChangeTimeMutation.mutate({
        time: {
          beginAt: null,
          endAt: null,
        },
        id: currentDDuDuId,
      });
      return;
    }

    const beginAt = `${beginHour < 10 ? `0${beginHour}` : beginHour}:${
      beginMin < 10 ? `0${beginMin}` : beginMin
    }:00`;
    const endAt = isEndTimeEnabled
      ? `${endHour < 10 ? `0${endHour}` : endHour}:${endMin < 10 ? `0${endMin}` : endMin}:00`
      : null;
    const time = {
      beginAt,
      endAt,
    };

    const isSameAsCurrent =
      currentDDuDuTime.beginAt === time.beginAt && currentDDuDuTime.endAt === time.endAt;

    if (isSameAsCurrent) {
      handleDDuDuTimeSheetToggleOff();
      return;
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
