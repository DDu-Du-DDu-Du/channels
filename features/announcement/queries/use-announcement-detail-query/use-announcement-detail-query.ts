import { ANNOUNCEMENT_KEY } from "@/constants/query-key/query-key";
import { getAnnouncementDetail } from "@/service/announcement/announcement";
import { useQuery } from "@tanstack/react-query";

interface UseAnnouncementDetailQueryProps {
  id?: number;
}

function useAnnouncementDetailQuery({ id }: UseAnnouncementDetailQueryProps) {
  return useQuery({
    queryKey: [ANNOUNCEMENT_KEY.DETAIL, id],
    queryFn: () => getAnnouncementDetail({ id: id! }),
    enabled: typeof id === "number" && Number.isFinite(id),
  });
}

export default useAnnouncementDetailQuery;
