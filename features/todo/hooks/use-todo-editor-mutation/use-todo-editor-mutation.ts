import { useTranslation } from "react-i18next";

import { useToast } from "@/components/toast/hooks";
import { FEED_KEY } from "@/constants/query-key/query-key";
import { fetchCreateTodo, fetchEditTodo } from "@/service/feed/feed";
import type { RequestTodo } from "@/types/request/feed/feed";
import type { CreateTodoResponseType } from "@/types/response/feed/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TodoEditorSubmitPayloadType } from "../../todo.types";

interface UseTodoEditorMutationProps {
  mode: "create" | "edit";
  TodoId?: number;
  selectedTodoDate: string;
  onSuccess: () => void;
}

const useTodoEditorMutation = ({
  mode,
  TodoId,
  selectedTodoDate,
  onSuccess,
}: UseTodoEditorMutationProps) => {
  const { t } = useTranslation();
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

  const buildTodoRequest = (payload: TodoEditorSubmitPayloadType): RequestTodo => ({
    goalId: payload.goalId,
    name: payload.title,
    memo: payload.memo || undefined,
    scheduledOn: payload.scheduledOn,
    beginAt: payload.isBeginTimeEnabled && payload.beginAt ? payload.beginAt : undefined,
    endAt:
      payload.isBeginTimeEnabled && payload.isEndTimeEnabled && payload.endAt
        ? payload.endAt
        : undefined,
    reminders: payload.reminders.map((reminder) => ({
      id: reminder.id,
      remindsAt: reminder.remindsAt,
    })),
  });

  const handleSubmit = async (payload: TodoEditorSubmitPayloadType) => {
    try {
      if (mode === "create") {
        if (!payload.goalId) {
          createToast(t("todo.missingGoalCreate"), { type: "danger" });
          return false;
        }

        const response = (await createTodoMutation.mutateAsync({
          requestTodo: buildTodoRequest(payload),
        })) as CreateTodoResponseType;

        if (!response?.id) {
          createToast(t("todo.detailSkipped"), { type: "warning" });
        }
      }

      if (mode === "edit") {
        if (!TodoId) {
          createToast(t("todo.missingTodoEdit"), { type: "danger" });
          return false;
        }

        if (!payload.goalId) {
          createToast(t("todo.missingGoalEdit"), { type: "danger" });
          return false;
        }

        await editTodoMutation.mutateAsync({
          id: TodoId,
          requestTodo: buildTodoRequest(payload),
        });
      }

      await handleRefetchFeedQueries();
      onSuccess();
      return true;
    } catch {
      createToast(mode === "create" ? t("todo.createFailed") : t("todo.editFailed"), {
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
