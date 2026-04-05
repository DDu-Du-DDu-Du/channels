import { FEED_KEY } from "@/constants/query-key/query-key";
import { createReminder, deleteReminder, updateReminder } from "@/service/reminder/reminder";
import handleInvalidateTodoLinkedQueries from "@/utils/invalidate-todo-linked-queries/invalidate-todo-linked-queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseReminderMutationsProps {
  todoId?: number;
  selectedTodoDate?: string;
  includeSearch?: boolean;
  shouldInvalidateOnSuccess?: boolean;
}

const useReminderMutations = ({
  todoId,
  selectedTodoDate,
  includeSearch = false,
  shouldInvalidateOnSuccess = true,
}: UseReminderMutationsProps = {}) => {
  const queryClient = useQueryClient();

  const createReminderMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_CHANGE_REMINDER, "create"],
    mutationFn: ({ todoId: targetTodoId, remindsAt }: { todoId: number; remindsAt: string }) =>
      createReminder({
        requestReminder: {
          todoId: targetTodoId,
          remindsAt,
        },
      }),
    onSuccess: async () => {
      if (!shouldInvalidateOnSuccess) {
        return;
      }

      await handleInvalidateTodoLinkedQueries(queryClient, {
        todoId,
        selectedTodoDate,
        includeSearch,
      });
    },
  });

  const updateReminderMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_CHANGE_REMINDER, "update"],
    mutationFn: ({ id, remindsAt }: { id: number; remindsAt: string }) =>
      updateReminder({
        id,
        requestReminder: {
          remindsAt,
        },
      }),
    onSuccess: async () => {
      if (!shouldInvalidateOnSuccess) {
        return;
      }

      await handleInvalidateTodoLinkedQueries(queryClient, {
        todoId,
        selectedTodoDate,
        includeSearch,
      });
    },
  });

  const deleteReminderMutation = useMutation({
    mutationKey: [FEED_KEY.Todo_CHANGE_REMINDER, "delete"],
    mutationFn: ({ id }: { id: number }) => deleteReminder(id),
    onSuccess: async () => {
      if (!shouldInvalidateOnSuccess) {
        return;
      }

      await handleInvalidateTodoLinkedQueries(queryClient, {
        todoId,
        selectedTodoDate,
        includeSearch,
      });
    },
  });

  const handleDeleteReminderBatch = async (reminderIds: number[]) => {
    if (reminderIds.length === 0) {
      return;
    }

    await Promise.allSettled(
      reminderIds.map((reminderId) => deleteReminderMutation.mutateAsync({ id: reminderId })),
    );
  };

  return {
    createReminderMutation,
    updateReminderMutation,
    deleteReminderMutation,
    handleDeleteReminderBatch,
  };
};

export default useReminderMutations;
