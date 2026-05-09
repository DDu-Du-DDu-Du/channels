import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/components/toast/hooks";
import { NOTIFICATION_KEY } from "@/constants/query-key/query-key";
import { getTodoDetail } from "@/service/feed/feed";
import { patchNotificationRead } from "@/service/notification/notification";
import type {
  NotificationContextType,
  NotificationInboxItemType,
} from "@/types/response/notification/notification";
import { parseUtc } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";

import { useNotificationInboxQuery } from "../../queries";

import { Href, useRouter } from "expo-router";
import { TFunction } from "i18next";

export type NotificationContextTab = "TODO" | "ANNOUNCEMENT";

export type TodoNotificationListEntry =
  | {
      type: "header";
      key: string;
      label: string;
    }
  | {
      type: "item";
      key: string;
      item: NotificationInboxItemType;
    };

export interface AnnouncementViewItem {
  key: string;
  item: NotificationInboxItemType;
  dateText: string;
  isUnread: boolean;
}

interface TodoDetailResponseType {
  scheduledOn: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_PAD_WIDTH = 2;

const normalizeContext = (context: NotificationContextType): NotificationContextTab | null => {
  const normalized = String(context).toUpperCase();

  if (normalized === "TODO" || normalized === "ANNOUNCEMENT") {
    return normalized;
  }

  return null;
};

const resolveGroupLabel = (createdAt: string, t: TFunction) => {
  const date = parseUtc(createdAt);
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((todayStart.getTime() - dateStart.getTime()) / DAY_MS);

  if (diffDays <= 0) {
    return t("dateTime.today");
  }

  return t("dateTime.relative.daysAgo", { count: diffDays });
};

const resolveAnnouncementDateText = (createdAt: string) => {
  try {
    const date = parseUtc(createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(DATE_PAD_WIDTH, "0");
    const day = String(date.getDate()).padStart(DATE_PAD_WIDTH, "0");
    return `${year}.${month}.${day}`;
  } catch {
    return "";
  }
};

function useNotificationScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { createToast } = useToast();
  const [selectedContext, setSelectedContext] = useState<NotificationContextTab>("TODO");
  const [loadingNotificationId, setLoadingNotificationId] = useState<number | null>(null);
  const [optimisticReadIds, setOptimisticReadIds] = useState<Set<number>>(new Set());
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useNotificationInboxQuery();

  const sourceItems = useMemo(() => {
    return data?.pages.flatMap((page) => page.contents) ?? [];
  }, [data?.pages]);

  const TodoItems = useMemo(
    () => sourceItems.filter((item) => normalizeContext(item.context) === "TODO"),
    [sourceItems],
  );
  const announcementItems = useMemo(
    () => sourceItems.filter((item) => normalizeContext(item.context) === "ANNOUNCEMENT"),
    [sourceItems],
  );

  const TodoListEntries = useMemo<TodoNotificationListEntry[]>(() => {
    const entries: TodoNotificationListEntry[] = [];
    let prevLabel = "";

    TodoItems.forEach((item) => {
      const label = resolveGroupLabel(item.createdAt, t);

      if (prevLabel !== label) {
        entries.push({
          type: "header",
          key: `header-${label}-${item.id}`,
          label,
        });
        prevLabel = label;
      }

      entries.push({
        type: "item",
        key: `item-${item.id}`,
        item,
      });
    });

    return entries;
  }, [TodoItems, t]);

  const announcementViewItems = useMemo<AnnouncementViewItem[]>(
    () =>
      announcementItems.map((item) => ({
        key: `announcement-${item.id}`,
        item,
        dateText: resolveAnnouncementDateText(item.createdAt),
        isUnread: !item.isRead && !optimisticReadIds.has(item.id),
      })),
    [announcementItems, optimisticReadIds],
  );

  const hasUnreadAnnouncement = useMemo(
    () => announcementViewItems.some((item) => item.isUnread),
    [announcementViewItems],
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const handlePressTodoNotification = async (item: NotificationInboxItemType) => {
    if (loadingNotificationId !== null) {
      return;
    }

    setLoadingNotificationId(item.id);

    try {
      const detail = (await getTodoDetail({ id: item.contextId })) as TodoDetailResponseType;
      if (!detail?.scheduledOn) {
        throw new Error("Invalid Todo detail response");
      }

      router.push(`/feed?date=${detail.scheduledOn}` as Href);
    } catch {
      createToast(t("notification.todoMoveFailed"), { type: "danger" });
    } finally {
      setLoadingNotificationId(null);
    }
  };

  const handlePressAnnouncement = async (item: NotificationInboxItemType) => {
    if (loadingNotificationId !== null) {
      return;
    }

    setLoadingNotificationId(item.id);
    const shouldOptimisticRead = !item.isRead && !optimisticReadIds.has(item.id);

    if (shouldOptimisticRead) {
      setOptimisticReadIds((prev) => new Set(prev).add(item.id));
    }

    try {
      const response = await patchNotificationRead({ id: item.id });
      const context = String(response.context).toLowerCase();
      router.push(`/${context}/${response.contextId}` as Href);
    } catch {
      if (shouldOptimisticRead) {
        setOptimisticReadIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }
      createToast(t("notification.announcementReadFailed"), { type: "danger" });
    } finally {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_KEY.INBOX_STATUS] });
      setLoadingNotificationId(null);
    }
  };

  return {
    selectedContext,
    setSelectedContext,
    TodoListEntries,
    announcementViewItems,
    hasUnreadAnnouncement,
    isLoading,
    isFetchingNextPage,
    loadingNotificationId,
    handleLoadMore,
    handlePressTodoNotification,
    handlePressAnnouncement,
  };
}

export default useNotificationScreen;
