import { Pressable, ScrollView, View } from "react-native";

import { SpoqaText } from "@/components";
import { ArrowLeftIcon } from "@/icons";

import { useLocalSearchParams, useRouter } from "expo-router";

interface AnnouncementDetailDummyType {
  title: string;
  date: string;
  body: string;
}

const ANNOUNCEMENT_DUMMY_MAP: Record<string, AnnouncementDetailDummyType> = {
  "3001": {
    title: "업데이트 안내",
    date: "2024.02.22",
    body: "공지사항 내용이 들어갈 곳 공지사항 내용이 들어갈 곳\n\n공지사항 내용이 들어갈 곳 공지사항 내용이 들어갈 곳 공지사항 내용이 들어갈 곳 공지사항 내용이 들어갈 곳 공지사항 내용이 들어갈 곳 공지사항 내용이 들어갈 곳 공지사항 내용이 들어갈 곳 공지사항 내용이 들어갈 곳",
  },
  "3002": {
    title: "점검 일정 안내",
    date: "2024.02.20",
    body: "점검 일정 관련 공지사항 더미 내용입니다.",
  },
};

function AnnouncementDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // TODO: Replace this dummy lookup with announcement detail API response.
  const detail = ANNOUNCEMENT_DUMMY_MAP[id ?? ""] ?? {
    title: "공지사항",
    date: "",
    body: "공지사항 상세 내용이 준비 중입니다.",
  };

  const handlePressBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-[#F5F5F5] px-[1.6rem] pt-[2.4rem]">
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <SpoqaText
          weight="semiBold"
          className="text-size18 text-black_500"
        >
          {detail.title}
        </SpoqaText>
        <SpoqaText className="mt-[0.8rem] text-size14 text-example_gray_900">
          {detail.date}
        </SpoqaText>

        <View className="my-[1.6rem] h-[1px] bg-[#D9D9D9]" />

        <SpoqaText className="text-size16 leading-[3rem] text-black_500">{detail.body}</SpoqaText>
      </ScrollView>
    </View>
  );
}

export default AnnouncementDetailScreen;
