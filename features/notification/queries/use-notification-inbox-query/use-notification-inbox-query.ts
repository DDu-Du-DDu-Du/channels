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
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor || undefined : undefined,
  });
}

export default useNotificationInboxQuery;
