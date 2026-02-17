import type { SubmitHandler, UseFormReset } from "react-hook-form";

import { FEED_KEY } from "@/constants/query-key/query-key";
import { fetchCreateDDuDu, fetchEditDDuDu } from "@/service/feed/feed";
import type { MainDDuDusType } from "@/types/response/feed/feed";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DDuDuInputType {
  ddudu: string;
}

interface UseUpdateDDuDuMutationProps {
  type: "create" | "edit";
  selectedDDuDuDate: string;
  goalId: number;
  dduduItem?: MainDDuDusType;
  reset: UseFormReset<DDuDuInputType>;
  onCloseDDuDuInput: () => void;
}

const useUpdateDDuDuMutation = ({
  type,
  selectedDDuDuDate,
  goalId,
  dduduItem,
  reset,
  onCloseDDuDuInput,
}: UseUpdateDDuDuMutationProps) => {
  const queryClient = useQueryClient();

  const onUpdateSuccess = () => {
    reset();
    onCloseDDuDuInput();
    queryClient.refetchQueries({ queryKey: [FEED_KEY.MONTHLY_DDUDUS] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.WEEKLY_DDUDUS] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_LIST, selectedDDuDuDate] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE, selectedDDuDuDate] });
  };

  const createDDuDuMutation = useMutation({
    mutationKey: [FEED_KEY.CREATE_DDUDU],
    mutationFn: fetchCreateDDuDu,
    onSuccess: onUpdateSuccess,
  });

  const editDDuDuMutation = useMutation({
    mutationKey: [FEED_KEY.EDIT_DDUDU],
    mutationFn: fetchEditDDuDu,
    onSuccess: onUpdateSuccess,
  });

  const onValid: SubmitHandler<DDuDuInputType> = ({ ddudu }) => {
    if (type === "create") {
      createDDuDuMutation.mutate({
        requestDDuDu: {
          goalId,
          name: ddudu,
          scheduledOn: selectedDDuDuDate,
        },
      });
    } else if (type === "edit" && dduduItem) {
      editDDuDuMutation.mutate({
        id: dduduItem.id,
        name: ddudu,
      });
    }
  };

  return { onValid };
};

export default useUpdateDDuDuMutation;
