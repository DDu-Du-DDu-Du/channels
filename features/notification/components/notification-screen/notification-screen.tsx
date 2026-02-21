import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

import { ReminderNotification, SelectChip, SpoqaText } from "@/components";
import {
  AnnouncementViewItem,
  DduduNotificationListEntry,
  useNotificationScreen,
} from "@/features/notification/hooks";
import { ArrowLeftIcon } from "@/icons";

import { useRouter } from "expo-router";

function NotificationScreen() {
  const router = useRouter();
  const {
    selectedContext,
    setSelectedContext,
    dduduListEntries,
    announcementViewItems,
    hasUnreadAnnouncement,
    isLoading,
    isFetchingNextPage,
    loadingNotificationId,
    handleLoadMore,
    handlePressDduduNotification,
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
            color="#8E8E8E"
          />
        </View>
      );
    }

    return (
      <View className="py-[3.2rem]">
        <SpoqaText className="text-center text-size13 text-example_gray_900">
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
            stroke="#1F1F1F"
          />
        </Pressable>
        <SpoqaText
          weight="bold"
          className="text-size18 text-black_500"
        >
          알림
        </SpoqaText>
      </View>

      <View className="mb-[1.6rem] flex-row gap-[1.2rem]">
        <SelectChip
          label="투두"
          selected={selectedContext === "DDUDU"}
          onPress={() => setSelectedContext("DDUDU")}
          selectedBackgroundColor="#E7E7E7"
          unselectedBackgroundColor="#F5F5F5"
          selectedTextClassName="text-black_500"
          unselectedTextClassName="text-example_gray_900"
          borderColor="#DDDDDD"
        />
        <View className="relative">
          <SelectChip
            label="공지사항"
            selected={selectedContext === "ANNOUNCEMENT"}
            onPress={() => setSelectedContext("ANNOUNCEMENT")}
            selectedBackgroundColor="#E7E7E7"
            unselectedBackgroundColor="#F5F5F5"
            selectedTextClassName="text-black_500"
            unselectedTextClassName="text-example_gray_900"
            borderColor="#DDDDDD"
          />
          {hasUnreadAnnouncement ? (
            <View className="absolute left-[0.4rem] top-[0.2rem] size-[0.7rem] rounded-circle bg-example_red_500" />
          ) : null}
        </View>
      </View>
    </View>
  );

  if (selectedContext === "DDUDU") {
    return (
      <View className="flex-1 bg-[#F5F5F5]">
        <FlatList<DduduNotificationListEntry>
          data={dduduListEntries}
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
                  <View className="h-[1px] flex-1 bg-[#DEDEDE]" />
                  <SpoqaText className="text-size11 text-[#C6C6C6]">{item.label}</SpoqaText>
                  <View className="h-[1px] flex-1 bg-[#DEDEDE]" />
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
                  bgColor="#E9E9E9"
                  isLoading={loadingNotificationId === item.item.id}
                  disabled={loadingNotificationId !== null}
                  onPress={() => handlePressDduduNotification(item.item)}
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

  return (
    <View className="flex-1 bg-[#F5F5F5]">
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
            className="flex-row items-center gap-[0.8rem] border-b border-[#DEDEDE] py-[1.4rem]"
          >
            <View className="w-[0.7rem] items-center justify-center">
              {item.isUnread ? (
                <View className="size-[0.6rem] rounded-circle bg-example_red_500" />
              ) : null}
            </View>
            <View className="flex-1">
              <SpoqaText
                weight="semiBold"
                className="text-size14 text-black_500"
              >
                {item.item.title}
              </SpoqaText>
              <SpoqaText className="mt-[0.4rem] text-size12 text-example_gray_900">
                {item.dateText}
              </SpoqaText>
            </View>
            {loadingNotificationId === item.item.id ? (
              <ActivityIndicator
                size="small"
                color="#6B6B6B"
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

export default NotificationScreen;
