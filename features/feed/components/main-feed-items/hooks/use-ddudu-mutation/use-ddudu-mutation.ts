import { FEED_KEY } from "@/constants/query-key/query-key";
import { fetchCompleteToggleDDuDu, fetchDeleteDDuDu } from "@/service/feed/feed";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseDDuDuMutationProps {
  selectedDDuDuDate: string;
  handleDDuDuSheetToggleOff: () => void;
}

const useDDuDuMutation = ({
  selectedDDuDuDate,
  handleDDuDuSheetToggleOff,
}: UseDDuDuMutationProps) => {
  const queryClient = useQueryClient();

  const handleSuccessDDuDu = () => {
    queryClient.refetchQueries({ queryKey: [FEED_KEY.MONTHLY_DDUDUS] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.WEEKLY_DDUDUS] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_LIST, selectedDDuDuDate] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE, selectedDDuDuDate] });
  };

  const deleteDDuDuMutation = useMutation({
    mutationKey: [FEED_KEY.DELETE_DDUDU],
    mutationFn: fetchDeleteDDuDu,
    onSuccess: () => {
      handleSuccessDDuDu();
      handleDDuDuSheetToggleOff();
    },
  });

  const completeToggleDDuDuMutation = useMutation({
    mutationKey: [FEED_KEY.COMPLETE_TOGGLE],
    mutationFn: fetchCompleteToggleDDuDu,
    onSuccess: handleSuccessDDuDu,
  });

  const onDDuDuCompleteToggle = (id: number) => {
    completeToggleDDuDuMutation.mutate({ id });
  };

  const onDeleteDDuDu = (id: number) => {
    deleteDDuDuMutation.mutate({ id });
  };

  return {
    onDDuDuCompleteToggle,
    onDeleteDDuDu,
  };
};

export default useDDuDuMutation;
