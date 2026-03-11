import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";
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
  const iconTone = useThemeColorToken("ui.icon.default");
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
      className="h-[3.2rem] w-[14.3rem] flex-row items-center overflow-hidden rounded-full border border-role-border-subtle dark:border-role-dark-border-subtle"
    >
      <View className="flex-[4] items-center justify-center border-r border-role-border-subtle dark:border-role-dark-border-subtle">
        <SpoqaText className="text-size12 text-role-text-primary dark:text-role-dark-text-primary">
          보기
        </SpoqaText>
      </View>

      <View className="flex-[7] flex-row items-center gap-[0.4rem] pl-[0.9rem]">
        {currentView === "timeline" ? (
          <TimelineIcon
            size={18}
            stroke={iconTone}
          />
        ) : (
          <ListIcon
            size={18}
            fill={iconTone}
          />
        )}
        <SpoqaText className="text-size13 text-role-text-primary dark:text-role-dark-text-primary">
          {currentLabel}
        </SpoqaText>
      </View>
    </Pressable>
  );
}

export default FeedViewToggleMenu;
