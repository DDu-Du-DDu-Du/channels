import { ANNOUNCEMENT_KEY } from "@/constants/query-key/query-key";
import { getAnnouncements } from "@/service/announcement/announcement";
import { useInfiniteQuery } from "@tanstack/react-query";

function useAnnouncementListQuery() {
  return useInfiniteQuery({
    queryKey: [ANNOUNCEMENT_KEY.LIST],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      getAnnouncements({
        size: 20,
        cursor: pageParam,
      }),
    // TODO(server): add hasNext boolean in announcement list response and prefer it for hasNextPage decision.
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
}

export default useAnnouncementListQuery;
