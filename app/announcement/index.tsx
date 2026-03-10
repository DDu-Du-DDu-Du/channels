import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

import { EmptyList, SpoqaText } from "@/components";
import { AnnouncementListViewItem, useAnnouncementScreen } from "@/features/announcement";
import { ArrowLeftIcon } from "@/icons";

import { useRouter } from "expo-router";

function Announcement() {
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
    <View className="flex-1 bg-[#F5F5F5]">
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
                stroke="#1F1F1F"
              />
            </Pressable>
            <SpoqaText
              weight="bold"
              className="text-size18 text-black_500"
            >
              공지사항
            </SpoqaText>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handlePressAnnouncement(item.id)}
            className="border-b border-[#E5E5E5] py-[1.4rem]"
          >
            <SpoqaText
              weight="semiBold"
              className="text-size15 text-black_500"
            >
              {item.title}
            </SpoqaText>
            <SpoqaText className="mt-[0.4rem] text-size12 text-example_gray_900">
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
                color="#8E8E8E"
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
