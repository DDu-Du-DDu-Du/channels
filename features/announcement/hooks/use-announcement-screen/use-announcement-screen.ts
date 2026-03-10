import { useMemo } from "react";

import { formatDateToYYYYMMDD, parseUtc } from "@/utils";

import { useAnnouncementListQuery } from "../../queries";

import { Href, useRouter } from "expo-router";

export interface AnnouncementListViewItem {
  key: string;
  id: string;
  title: string;
  dateText: string;
}

const parseDateText = (createdAt: string) => {
  try {
    return formatDateToYYYYMMDD(parseUtc(createdAt));
  } catch {
    return "";
  }
};

function useAnnouncementScreen() {
  const router = useRouter();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError } =
    useAnnouncementListQuery();

  const announcementViewItems = useMemo<AnnouncementListViewItem[]>(() => {
    const sourceItems = data?.pages.flatMap((page) => page.contents) ?? [];

    return sourceItems.map((item) => ({
      key: `announcement-${item.id}`,
      id: String(item.id),
      title: item.title,
      dateText: parseDateText(item.createdAt),
    }));
  }, [data?.pages]);

  const handlePressAnnouncement = (id: string) => {
    router.push({
      pathname: "/announcement/[id]" as Href,
      params: { id },
    });
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  return {
    announcementViewItems,
    isLoading,
    isError,
    isFetchingNextPage,
    handlePressAnnouncement,
    handleLoadMore,
  };
}

export default useAnnouncementScreen;
