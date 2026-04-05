import { NOTIFICATION_KEY } from "@/constants/query-key/query-key";
import { getNotificationInboxStatus } from "@/service/notification/notification";
import { useAuthStore } from "@/stores";
import type { NotificationInboxStatusType } from "@/types/response/notification/notification";
import { useQuery } from "@tanstack/react-query";

function useNotificationInboxStatusQuery() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const hasTokens = useAuthStore((state) => Boolean(state.accessToken && state.refreshToken));
  const isMemberSession = useAuthStore((state) => state.sessionType === "member");

  return useQuery<NotificationInboxStatusType>({
    queryKey: [NOTIFICATION_KEY.INBOX_STATUS],
    queryFn: getNotificationInboxStatus,
    enabled: hasHydrated && hasTokens && isMemberSession,
    staleTime: 60 * 1000,
    retry: false,
  });
}

export default useNotificationInboxStatusQuery;
