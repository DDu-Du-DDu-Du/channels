import { NOTIFICATION_KEY } from "@/constants/query-key/query-key";
import { getNotificationInbox } from "@/service/notification/notification";
import { useInfiniteQuery } from "@tanstack/react-query";

function useNotificationInboxQuery() {
  return useInfiniteQuery({
    queryKey: [NOTIFICATION_KEY.INBOX],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      getNotificationInbox({
        size: 20,
        cursor: pageParam,
      }),
    // TODO(server): add hasNext boolean in notification inbox response and prefer it for hasNextPage decision.
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
}

export default useNotificationInboxQuery;
