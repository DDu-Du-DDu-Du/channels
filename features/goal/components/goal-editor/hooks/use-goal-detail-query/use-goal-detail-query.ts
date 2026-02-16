import { GOAL_KEY } from "@/constants/query-key/query-key";
import { type RepeatDduduItemType, mapRepeatDduduResponseToItem } from "@/features/repeat-ddudu";
import { getGoalDetail } from "@/service/goal/goal";
import type { GoalDetailType } from "@/types/response/goal/goal";
import { useQuery } from "@tanstack/react-query";

export type GoalEditorDetailType = Omit<GoalDetailType, "repeatDdudus"> & {
  repeatDdudus: RepeatDduduItemType[];
};

interface UseGoalDetailQueryProps {
  goalId: number;
}

function useGoalDetailQuery({ goalId }: UseGoalDetailQueryProps) {
  return useQuery<GoalEditorDetailType>({
    queryKey: [GOAL_KEY.GOAL_DETAIL, goalId],
    queryFn: async () => {
      const goalDetail = await getGoalDetail({ goalId });

      return {
        ...goalDetail,
        repeatDdudus: (goalDetail.repeatDdudus ?? []).map(mapRepeatDduduResponseToItem),
      };
    },
    enabled: Boolean(goalId),
  });
}

export default useGoalDetailQuery;
