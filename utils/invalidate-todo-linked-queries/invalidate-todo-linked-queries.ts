import { FEED_KEY, Todo_KEY } from "@/constants/query-key/query-key";
import { QueryClient } from "@tanstack/react-query";

interface InvalidateTodoLinkedQueriesOptions {
  todoId?: number;
  selectedTodoDate?: string;
  includeSearch?: boolean;
  includeDashboard?: boolean;
}

const handleInvalidateTodoLinkedQueries = async (
  queryClient: QueryClient,
  {
    todoId,
    selectedTodoDate,
    includeSearch = false,
    includeDashboard = false,
  }: InvalidateTodoLinkedQueriesOptions = {},
) => {
  const invalidateTasks: Promise<unknown>[] = [
    queryClient.invalidateQueries({ queryKey: [FEED_KEY.Todo_DETAIL] }),
    queryClient.invalidateQueries({ queryKey: [FEED_KEY.Todo_REMINDER_LIST] }),
    queryClient.invalidateQueries({ queryKey: [FEED_KEY.DAILY_LIST] }),
    queryClient.invalidateQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE] }),
    queryClient.invalidateQueries({ queryKey: [FEED_KEY.MONTHLY_Todos] }),
    queryClient.invalidateQueries({ queryKey: [FEED_KEY.WEEKLY_Todos] }),
  ];

  if (todoId) {
    invalidateTasks.push(
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.Todo_DETAIL, todoId] }),
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.Todo_REMINDER_LIST, todoId] }),
    );
  }

  if (selectedTodoDate) {
    invalidateTasks.push(
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.DAILY_LIST, selectedTodoDate] }),
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE, selectedTodoDate] }),
    );
  }

  if (includeSearch) {
    invalidateTasks.push(queryClient.invalidateQueries({ queryKey: [Todo_KEY.SEARCH] }));
  }

  if (includeDashboard) {
    invalidateTasks.push(queryClient.invalidateQueries({ queryKey: [Todo_KEY.DASHBOARD] }));
  }

  await Promise.all(invalidateTasks);
};

export default handleInvalidateTodoLinkedQueries;
