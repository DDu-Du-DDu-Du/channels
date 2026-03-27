import { Todo_KEY } from "@/constants/query-key/query-key";
import { getTodosearch } from "@/service/todo/todo";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseTodosearchQueryProps {
  query: string;
}

function useTodosearchQuery({ query }: UseTodosearchQueryProps) {
  return useInfiniteQuery({
    queryKey: [Todo_KEY.SEARCH, query],
    initialPageParam: null as string | null,
    enabled: query.trim().length > 0,
    queryFn: ({ pageParam }) =>
      getTodosearch({
        query,
        size: 20,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor || undefined : undefined,
  });
}

export default useTodosearchQuery;
