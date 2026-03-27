import { useToast } from "@/components/toast/hooks";
import { FEED_KEY } from "@/constants/query-key/query-key";
import { fetchCreateTodo, fetchEditTodo } from "@/service/feed/feed";
import type { RequestTodo } from "@/types/request/feed/feed";
import type { CreateTodoResponseType } from "@/types/response/feed/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TodoEditorSubmitPayloadType } from "../../todo.types";

interface UseTodoEditorMutationProps {
  mode: "create" | "edit";
  goalId?: number;
  TodoId?: number;
  selectedTodoDate: string;
  onSuccess: () => void;
}

const useTodoEditorMutation = ({
  mode,
  goalId,
  TodoId,
  selectedTodoDate,
  onSuccess,
}: UseTodoEditorMutationProps) => {
  const queryClient = useQueryClient();
  const { createToast } = useToast();

  const createTodoMutation = useMutation({
    mutationKey: [FEED_KEY.CREATE_Todo],
    mutationFn: fetchCreateTodo,
  });

  const editTodoMutation = useMutation({
    mutationKey: [FEED_KEY.EDIT_Todo],
    mutationFn: fetchEditTodo,
  });

  const handleRefetchFeedQueries = async () => {
    await Promise.all([
      queryClient.refetchQueries({ queryKey: [FEED_KEY.MONTHLY_Todos] }),
      queryClient.refetchQueries({ queryKey: [FEED_KEY.WEEKLY_Todos] }),
      queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_LIST, selectedTodoDate] }),
      queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE, selectedTodoDate] }),
    ]);
  };

  const buildTodoRequest = (
    todoGoalId: number,
    payload: TodoEditorSubmitPayloadType,
  ): RequestTodo => ({
    goalId: todoGoalId,
    name: payload.title,
    memo: payload.memo || undefined,
    scheduledOn: payload.scheduledOn,
    beginAt: payload.isBeginTimeEnabled && payload.beginAt ? payload.beginAt : undefined,
    endAt:
      payload.isBeginTimeEnabled && payload.isEndTimeEnabled && payload.endAt
        ? payload.endAt
        : undefined,
    remindDays: payload.reminder.enabled ? payload.reminder.day : undefined,
    remindHours: payload.reminder.enabled ? payload.reminder.hour : undefined,
    remindMinutes: payload.reminder.enabled ? payload.reminder.minute : undefined,
  });

  const handleSubmit = async (payload: TodoEditorSubmitPayloadType) => {
    try {
      if (mode === "create") {
        if (!goalId) {
          createToast("목표 정보가 없어 투두를 생성할 수 없어요.", { type: "danger" });
          return false;
        }

        const response = (await createTodoMutation.mutateAsync({
          requestTodo: buildTodoRequest(goalId, payload),
        })) as CreateTodoResponseType;

        if (!response?.id) {
          createToast("투두 생성은 완료됐지만 상세 저장은 건너뛰었어요.", { type: "warning" });
        }
      }

      if (mode === "edit") {
        if (!TodoId) {
          createToast("투두 정보가 없어 수정할 수 없어요.", { type: "danger" });
          return false;
        }

        if (!goalId) {
          createToast("목표 정보가 없어 투두를 수정할 수 없어요.", { type: "danger" });
          return false;
        }

        await editTodoMutation.mutateAsync({
          id: TodoId,
          requestTodo: buildTodoRequest(goalId, payload),
        });
      }

      await handleRefetchFeedQueries();
      onSuccess();
      return true;
    } catch {
      createToast(mode === "create" ? "투두 생성에 실패했어요." : "투두 수정에 실패했어요.", {
        type: "danger",
      });
      return false;
    }
  };

  return {
    isPending: createTodoMutation.isPending || editTodoMutation.isPending,
    handleSubmit,
  };
};

export default useTodoEditorMutation;
