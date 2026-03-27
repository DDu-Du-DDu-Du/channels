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
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor || undefined : undefined,
  });
}

export default useAnnouncementListQuery;
