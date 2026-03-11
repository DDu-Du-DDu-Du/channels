import { Pressable, View } from "react-native";

import { ShakingCheckIcon, SpoqaText } from "@/components";
import { OptionIcon } from "@/icons";
import type { DDuDuSearchItemType } from "@/types/response/ddudu/ddudu";

export interface DDuDuSearchItemProps {
  item: DDuDuSearchItemType;
  onCompleteToggle: (id: number) => void;
  onOpenMenu: (id: number) => void;
}

function DDuDuSearchItem({ item, onCompleteToggle, onOpenMenu }: DDuDuSearchItemProps) {
  // TODO: SEARCH API 응답에 status 포함되면 fallback 제거
  const status = item.status ?? "UNCOMPLETED";
  const isCompleted = status === "COMPLETE";

  return (
    <View className="mb-[0.7rem] w-full flex-row items-center rounded-radius15 border-[0.1rem] border-role-border-subtle dark:border-role-dark-border-subtle/15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas/6">
      <View className="items-center justify-center px-[1.1rem] py-[1.2rem]">
        <ShakingCheckIcon
          isChecked={isCompleted}
          color="C9C9CE"
          size={24}
          borderStrokeAlpha={0.65}
          onPress={() => onCompleteToggle(item.id)}
        />
      </View>

      <Pressable
        onPress={() => onOpenMenu(item.id)}
        className="flex-1 py-[1rem] pr-[1rem]"
      >
        <SpoqaText
          weight="regular"
          numberOfLines={1}
          className="text-size14 text-role-text-inverse dark:text-role-dark-text-inverse"
        >
          {item.name}
        </SpoqaText>
        <SpoqaText
          weight="regular"
          className="mt-[0.3rem] text-size12 text-role-text-inverse dark:text-role-dark-text-inverse/65"
        >
          {item.scheduledOn}
        </SpoqaText>
      </Pressable>

      <Pressable
        onPress={() => onOpenMenu(item.id)}
        hitSlop={8}
        className="items-center justify-center px-[1.4rem] py-[1.2rem]"
      >
        <OptionIcon fill="#D9D9D9" />
      </Pressable>
    </View>
  );
}

export default DDuDuSearchItem;
