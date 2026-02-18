import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { ListIcon, TimelineIcon } from "@/icons";

import { useLocalSearchParams, useRouter } from "expo-router";

type FeedViewType = "list" | "timeline";

const toSingleParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const resolveFeedView = (view: string | undefined): FeedViewType => {
  return view === "timeline" ? "timeline" : "list";
};

function FeedViewToggleMenu() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const currentView: FeedViewType = resolveFeedView(toSingleParam(params.view));
  const currentLabel = currentView === "timeline" ? "타임라인" : "리스트";
  const nextView: FeedViewType = currentView === "list" ? "timeline" : "list";

  const handlePressToggleView = () => {
    router.setParams({ view: nextView });
  };

  return (
    <Pressable
      onPress={handlePressToggleView}
      hitSlop={8}
      className="h-[3.2rem] w-[14.3rem] flex-row items-center overflow-hidden rounded-full border border-white"
    >
      <View className="flex-[4] items-center justify-center border-r border-white">
        <SpoqaText className="text-size12 text-white">보기</SpoqaText>
      </View>

      <View className="flex-[7] flex-row items-center gap-[0.4rem] pl-[0.9rem]">
        {currentView === "timeline" ? (
          <TimelineIcon
            size={18}
            stroke="#FFFFFF"
          />
        ) : (
          <ListIcon
            size={18}
            fill="#FFFFFF"
          />
        )}
        <SpoqaText className="text-size13 text-white">{currentLabel}</SpoqaText>
      </View>
    </Pressable>
  );
}

export default FeedViewToggleMenu;
