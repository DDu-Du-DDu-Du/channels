// useMe.ts
import { USER_KEY } from "@/constants/query-key/query-key";
import { getMe } from "@/service/user/user";
import { useAuthStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";

interface UseMeProps {
  readOnly?: boolean;
}

function useMe({ readOnly = false }: UseMeProps) {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const hasTokens = useAuthStore((state) => !!state.accessToken && !!state.refreshToken);
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: [USER_KEY.ME, accessToken],
    enabled: !readOnly && hasHydrated && hasTokens,
    queryFn: () => getMe({ accessToken: accessToken! }),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}

export default useMe;
