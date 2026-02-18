import { DDUDU_KEY } from "@/constants/query-key/query-key";
import { getDDuDuSearch } from "@/service/ddudu/ddudu";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseDDuDuSearchQueryProps {
  query: string;
}

function useDDuDuSearchQuery({ query }: UseDDuDuSearchQueryProps) {
  return useInfiniteQuery({
    queryKey: [DDUDU_KEY.SEARCH, query],
    initialPageParam: null as string | null,
    enabled: query.trim().length > 0,
    queryFn: ({ pageParam }) =>
      getDDuDuSearch({
        query,
        size: 20,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
}

export default useDDuDuSearchQuery;
