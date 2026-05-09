import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

import { EmptyList, HeaderRightActions, PageHeader, SpoqaText } from "@/components";
import { AnnouncementListViewItem, useAnnouncementScreen } from "@/features/announcement";
import { useWideLayout } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";

function Announcement() {
  const { t } = useTranslation();
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
      return <EmptyList text={t("common.loading")} />;
    }

    if (isError) {
      return <EmptyList text={t("announcement.loadFailed")} />;
    }

    return <EmptyList text={t("announcement.empty")} />;
  };
  const listClassName = isWideLayout ? "w-full max-w-[86rem] self-center" : "";

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title={t("announcement.title")}
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
