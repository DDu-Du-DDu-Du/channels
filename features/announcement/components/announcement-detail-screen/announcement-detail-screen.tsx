import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { EmptyList, SpoqaText } from "@/components";
import { useAnnouncementDetailScreen } from "@/features/announcement/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ArrowLeftIcon } from "@/icons";

import { useRouter } from "expo-router";

function AnnouncementDetailScreen() {
  const iconStroke = useThemeColorToken("role.icon.default");
  const spinnerColor = useThemeColorToken("role.text.tertiary");
  const router = useRouter();
  const { detail, isLoading, isError } = useAnnouncementDetailScreen();

  const handlePressBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel px-[1.6rem] pt-[2.4rem]">
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
