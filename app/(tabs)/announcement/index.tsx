import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

import { EmptyList, HeaderRightActions, PageHeader, SpoqaText } from "@/components";
import { AnnouncementListViewItem, useAnnouncementScreen } from "@/features/announcement";
import { useWideLayout } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";

function Announcement() {
  const { isWideLayout } = useWideLayout();
  const spinnerColor = useThemeColorToken("role.text.tertiary");
  const {
    announcementViewItems,
    isLoading,
    isError,
    isFetchingNextPage,
    handlePressAnnouncement,
    handleLoadMore,
  } = useAnnouncementScreen();

  const renderEmpty = () => {
    if (isLoading) {
      return <EmptyList text="불러오는 중..." />;
    }

    if (isError) {
      return <EmptyList text="공지사항을 불러오지 못했어요." />;
    }

    return <EmptyList text="공지사항이 없어요." />;
  };
  const listClassName = isWideLayout ? "w-full max-w-[86rem] self-center" : "";

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="공지사항"
        rightContent={<HeaderRightActions />}
      />
      <FlatList<AnnouncementListViewItem>
        className={listClassName}
        data={announcementViewItems}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 28,
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handlePressAnnouncement(item.id)}
            className="border-b border-role-border-subtle dark:border-role-dark-border-subtle py-[1.4rem]"
          >
            <SpoqaText
              weight="semiBold"
              className="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
            >
              {item.title}
            </SpoqaText>
            <SpoqaText className="mt-[0.4rem] text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
              {item.dateText}
            </SpoqaText>
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

export default Announcement;
