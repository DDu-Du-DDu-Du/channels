import { ActivityIndicator, ScrollView, View } from "react-native";

import { EmptyList, SpoqaText } from "@/components";
import { useAnnouncementDetailScreen } from "@/features/announcement/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";

function AnnouncementDetailScreen() {
  const spinnerColor = useThemeColorToken("role.text.tertiary");
  const { detail, isLoading, isError } = useAnnouncementDetailScreen();

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel px-[1.6rem]">
      {isLoading ? (
        <View className="py-[3.2rem]">
          <ActivityIndicator
            size="small"
            color={spinnerColor}
          />
        </View>
      ) : isError ? (
        <EmptyList text="공지사항 상세를 불러오지 못했어요." />
      ) : !detail ? (
        <EmptyList text="공지사항 상세가 없어요." />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28 }}
        >
          <SpoqaText
            weight="semiBold"
            className="text-size18 text-role-text-primary dark:text-role-dark-text-primary"
          >
            {detail.title}
          </SpoqaText>
          <SpoqaText className="mt-[0.8rem] text-size14 text-role-text-secondary dark:text-role-dark-text-secondary">
            {detail.dateText}
          </SpoqaText>
          {detail.author ? (
            <SpoqaText className="mt-[0.4rem] text-size13 text-role-text-secondary dark:text-role-dark-text-secondary">
              작성자: {detail.author}
            </SpoqaText>
          ) : null}

          <View className="my-[1.6rem] h-[1px] bg-role-surface-muted dark:bg-role-dark-surface-muted" />

          <SpoqaText className="text-size16 leading-[3rem] text-role-text-primary dark:text-role-dark-text-primary">
            {detail.body}
          </SpoqaText>
        </ScrollView>
      )}
    </View>
  );
}

export default AnnouncementDetailScreen;
