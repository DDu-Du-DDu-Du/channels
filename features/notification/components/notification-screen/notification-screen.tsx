import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

import { ReminderNotification, SelectChip, SpoqaText } from "@/components";
import {
  AnnouncementViewItem,
  TodoNotificationListEntry,
  useNotificationScreen,
} from "@/features/notification/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ArrowLeftIcon } from "@/icons";

import { useRouter } from "expo-router";

function NotificationScreen() {
  const router = useRouter();
  const iconStroke = useThemeColorToken("role.icon.default");
  const spinnerColor = useThemeColorToken("role.text.tertiary");
  const spinnerEmphasisColor = useThemeColorToken("role.text.secondary");
  const selectedChipBg = useThemeColorToken("role.surface.subtle");
  const unselectedChipBg = useThemeColorToken("role.surface.panel");
  const chipBorderColor = useThemeColorToken("role.border.default");
  const reminderBg = useThemeColorToken("role.surface.subtle");
  const {
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
  } = useNotificationScreen();

  const handlePressBack = () => {
    router.back();
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View className="py-[3.2rem]">
          <ActivityIndicator
            size="small"
            color={spinnerColor}
          />
        </View>
      );
    }

    return (
      <View className="py-[3.2rem]">
        <SpoqaText className="text-center text-size13 text-role-text-secondary dark:text-role-dark-text-secondary">
          {selectedContext === "ANNOUNCEMENT" ? "공지사항이 없어요." : "알림이 없어요."}
        </SpoqaText>
      </View>
    );
  };

  const listHeader = (
    <View>
      <View className="relative items-center justify-center pb-[2.6rem]">
        <Pressable
          onPress={handlePressBack}
          className="absolute left-0 top-0 size-[2.4rem] items-start justify-center"
          hitSlop={8}
        >
          <ArrowLeftIcon
            size={16}
            stroke={iconStroke}
          />
        </Pressable>
        <SpoqaText
          weight="bold"
          className="text-size18 text-role-text-primary dark:text-role-dark-text-primary"
        >
          알림
        </SpoqaText>
      </View>

      <View className="mb-[1.6rem] flex-row gap-[1.2rem]">
        <SelectChip
          label="투두"
          selected={selectedContext === "Todo"}
          onPress={() => setSelectedContext("Todo")}
          selectedBackgroundColor={selectedChipBg}
          unselectedBackgroundColor={unselectedChipBg}
          selectedTextClassName="text-role-text-primary dark:text-role-dark-text-primary"
          unselectedTextClassName="text-role-text-secondary dark:text-role-dark-text-secondary"
          borderColor={chipBorderColor}
        />
        <View className="relative">
          <SelectChip
            label="공지사항"
            selected={selectedContext === "ANNOUNCEMENT"}
            onPress={() => setSelectedContext("ANNOUNCEMENT")}
            selectedBackgroundColor={selectedChipBg}
            unselectedBackgroundColor={unselectedChipBg}
            selectedTextClassName="text-role-text-primary dark:text-role-dark-text-primary"
            unselectedTextClassName="text-role-text-secondary dark:text-role-dark-text-secondary"
            borderColor={chipBorderColor}
          />
          {hasUnreadAnnouncement ? (
            <View className="absolute left-[0.4rem] top-[0.2rem] size-[0.7rem] rounded-circle bg-role-status-error dark:bg-role-dark-status-error" />
          ) : null}
        </View>
      </View>
    </View>
  );

  if (selectedContext === "Todo") {
    return (
      <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
        <FlatList<TodoNotificationListEntry>
          data={TodoListEntries}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 28,
          }}
          ListHeaderComponent={listHeader}
          renderItem={({ item }) => {
            if (item.type === "header") {
              return (
                <View className="mb-[1.2rem] mt-[0.8rem] flex-row items-center gap-[1.2rem]">
                  <View className="h-[1px] flex-1 bg-role-border-subtle dark:bg-role-dark-border-subtle" />
                  <SpoqaText className="text-size11 text-role-text-tertiary dark:text-role-dark-text-tertiary">
                    {item.label}
                  </SpoqaText>
                  <View className="h-[1px] flex-1 bg-role-border-subtle dark:bg-role-dark-border-subtle" />
                </View>
              );
            }

            return (
              <View className="mb-[1.2rem]">
                <ReminderNotification
                  id={item.item.id}
                  title={item.item.title}
                  body={item.item.body}
                  context={item.item.context}
                  createdAt={item.item.createdAt}
                  bgColor={reminderBg}
                  isLoading={loadingNotificationId === item.item.id}
                  disabled={loadingNotificationId !== null}
                  onPress={() => handlePressTodoNotification(item.item)}
                />
              </View>
            );
          }}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-[1.2rem]">
                <ActivityIndicator
                  size="small"
                  color={spinnerColor}
                />
              </View>
            ) : null
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.35}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <FlatList<AnnouncementViewItem>
        data={announcementViewItems}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 28,
        }}
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handlePressAnnouncement(item.item)}
            disabled={loadingNotificationId !== null}
            className="flex-row items-center gap-[0.8rem] border-b border-role-border-subtle dark:border-role-dark-border-subtle py-[1.4rem]"
          >
            <View className="w-[0.7rem] items-center justify-center">
              {item.isUnread ? (
                <View className="size-[0.6rem] rounded-circle bg-role-status-error dark:bg-role-dark-status-error" />
              ) : null}
            </View>
            <View className="flex-1">
              <SpoqaText
                weight="semiBold"
                className="text-size14 text-role-text-primary dark:text-role-dark-text-primary"
              >
                {item.item.title}
              </SpoqaText>
              <SpoqaText className="mt-[0.4rem] text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
                {item.dateText}
              </SpoqaText>
            </View>
            {loadingNotificationId === item.item.id ? (
              <ActivityIndicator
                size="small"
                color={spinnerEmphasisColor}
              />
            ) : null}
          </Pressable>
        )}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-[1.2rem]">
              <ActivityIndicator
                size="small"
                color={spinnerColor}
              />
            </View>
          ) : null
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.35}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default NotificationScreen;
