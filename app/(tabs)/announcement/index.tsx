import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

import { EmptyList, SpoqaText } from "@/components";
import { AnnouncementListViewItem, useAnnouncementScreen } from "@/features/announcement";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ArrowLeftIcon } from "@/icons";

import { useRouter } from "expo-router";

function Announcement() {
  const iconStroke = useThemeColorToken("role.icon.default");
  const spinnerColor = useThemeColorToken("role.text.tertiary");
  const router = useRouter();
  const {
    announcementViewItems,
    isLoading,
    isError,
    isFetchingNextPage,
    handlePressAnnouncement,
    handleLoadMore,
  } = useAnnouncementScreen();

  const handlePressBack = () => {
    router.back();
  };

  const renderEmpty = () => {
    if (isLoading) {
      return <EmptyList text="불러오는 중..." />;
    }

    if (isError) {
      return <EmptyList text="공지사항을 불러오지 못했어요." />;
    }

    return <EmptyList text="공지사항이 없어요." />;
  };

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <FlatList<AnnouncementListViewItem>
        data={announcementViewItems}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 28,
        }}
        ListHeaderComponent={
          <View className="relative items-center justify-center pb-[2.8rem]">
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
              공지사항
            </SpoqaText>
          </View>
        }
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
