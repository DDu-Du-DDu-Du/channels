import { GOAL_KEY } from "@/constants/query-key/query-key";
import { type RepeatTodoItemType, mapRepeatTodoResponseToItem } from "@/features/repeat-todo";
import { getGoalDetail } from "@/service/goal/goal";
import type { GoalDetailType } from "@/types/response/goal/goal";
import { useQuery } from "@tanstack/react-query";

export type GoalEditorDetailType = Omit<GoalDetailType, "repeatTodos"> & {
  repeatTodos: RepeatTodoItemType[];
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
        repeatTodos: (goalDetail.repeatTodos ?? goalDetail.repeatTodos ?? []).map(
          mapRepeatTodoResponseToItem,
        ),
      };
    },
    enabled: Boolean(goalId),
  });
}

export default useGoalDetailQuery;
