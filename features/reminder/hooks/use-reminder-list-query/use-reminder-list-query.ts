import { FEED_KEY } from "@/constants/query-key/query-key";
import { getReminderList } from "@/service/reminder/reminder";
import { useQuery } from "@tanstack/react-query";

interface UseReminderListQueryOptions {
  todoId: number;
  includeSent?: boolean;
  enabled?: boolean;
}

const useReminderListQuery = ({
  todoId,
  includeSent = true,
  enabled = true,
}: UseReminderListQueryOptions) => {
  return useQuery({
    queryKey: [FEED_KEY.Todo_REMINDER_LIST, todoId],
    queryFn: () => getReminderList({ todoId, includeSent }),
    enabled: enabled && todoId > 0,
  });
};

export default useReminderListQuery;
