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
  const isEnabled = hasHydrated && hasTokens;

  return useQuery({
    queryKey: [USER_KEY.ME, accessToken],
    enabled: isEnabled,
    queryFn: () => getMe({ accessToken: accessToken! }),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: readOnly ? 10 * 60 * 1000 : undefined,
  });
}

export default useMe;
