import { Pressable, ScrollView, View } from "react-native";

import { SpoqaText } from "@/components";
import { ArrowLeftIcon } from "@/icons";

import { useRouter } from "expo-router";

const DUMMY_ANNOUNCEMENTS = [
  { id: "3001", title: "서비스 업데이트 안내", date: "2026.02.22" },
  { id: "3002", title: "점검 일정 공지", date: "2026.02.20" },
];

function Announcement() {
  const router = useRouter();

  const handlePressBack = () => {
    router.back();
  };

  const handlePressAnnouncement = (id: string) => {
    router.push({
      pathname: "/announcement/[id]",
      params: { id },
    });
  };

  // TODO: 서버 공지사항 fetch 로직 추가

  return (
    <View className="flex-1 bg-[#F5F5F5] px-[2.4rem] pt-[2.4rem]">
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
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {DUMMY_ANNOUNCEMENTS.map((item) => (
          <Pressable
            key={item.id}
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
              {item.date}
            </SpoqaText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export default Announcement;
