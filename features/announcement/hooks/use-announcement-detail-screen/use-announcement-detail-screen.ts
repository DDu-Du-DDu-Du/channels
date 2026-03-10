import { useMemo } from "react";

import { formatDateToYYYYMMDD, parseUtc } from "@/utils";

import { useAnnouncementDetailQuery } from "../../queries";

import { useLocalSearchParams } from "expo-router";

interface AnnouncementDetailViewModel {
  title: string;
  body: string;
  dateText: string;
  author: string;
}

const parseDateText = (createdAt: string) => {
  try {
    return formatDateToYYYYMMDD(parseUtc(createdAt));
  } catch {
    return "";
  }
};

function useAnnouncementDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = rawId ? Number(rawId) : undefined;
  const parsedId = typeof id === "number" && Number.isFinite(id) ? id : undefined;
  const query = useAnnouncementDetailQuery({ id: parsedId });

  const detail = useMemo<AnnouncementDetailViewModel | undefined>(() => {
    if (query.data) {
      return {
        title: query.data.title,
        body: query.data.body,
        dateText: parseDateText(query.data.createdAt),
        author: query.data.author,
      };
    }

    return undefined;
  }, [query.data]);

  return {
    detail,
    isLoading: query.isLoading,
    isError: query.isError || parsedId === undefined,
  };
}

export default useAnnouncementDetailScreen;
