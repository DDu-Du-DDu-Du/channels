import { FlatList, Pressable, View } from "react-native";

import { ConfirmModal, FormHeader } from "@/components";
import type { RepeatDduduItemType } from "@/features/repeat-ddudu/repeat-ddudu.types";
import { PlusIcon } from "@/icons";

import SwipeableRepeatDduduCard from "../swipeable-repeat-ddudu-card/swipeable-repeat-ddudu-card";

export interface RepeatDduduListViewProps {
  repeatDdudus: RepeatDduduItemType[];
  onPressBack: () => void;
  onPressAdd: () => void;
  onPressRepeatDdudu: (repeatDdudu: RepeatDduduItemType) => void;
  onPressDeleteRepeatDdudu: (repeatDduduId?: number) => void;
  isDeleteConfirmOpen: boolean;
  onCompleteDeleteRepeatDdudu: (isComplete: boolean) => void;
  onCloseDeleteModal: () => void;
}

function RepeatDduduListView({
  repeatDdudus,
  onPressBack,
  onPressAdd,
  onPressRepeatDdudu,
  onPressDeleteRepeatDdudu,
  isDeleteConfirmOpen,
  onCompleteDeleteRepeatDdudu,
  onCloseDeleteModal,
}: RepeatDduduListViewProps) {
  const rightContent = (
    <Pressable
      onPress={onPressAdd}
      className="size-[2.4rem] items-end justify-center"
      hitSlop={8}
    >
      <PlusIcon
        size={14}
        fill="#FFFFFF"
      />
    </Pressable>
  );

  return (
    <>
      <View className="px-[2.4rem] pb-[1.6rem] pt-[2.4rem]">
        <View className="relative">
          <FormHeader
            title={"반복뚜두"}
            onPressBack={onPressBack}
            className="p-0"
          />
          <View className="absolute right-0 top-0">{rightContent}</View>
        </View>
      </View>

      <FlatList
        data={repeatDdudus}
        keyExtractor={(item, index) => `${item.id ?? index}-${item.name}`}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 24,
          rowGap: 12,
        }}
        renderItem={({ item }) => (
          <SwipeableRepeatDduduCard
            repeatDdudu={item}
            onPress={() => onPressRepeatDdudu(item)}
            onPressDelete={() => onPressDeleteRepeatDdudu(item.id)}
          />
        )}
      />

      <ConfirmModal
        isToggle={isDeleteConfirmOpen}
        title={"반복뚜두를 삭제할까요?"}
        message={"삭제 후에는 되돌릴 수 없습니다."}
        completeText={"삭제"}
        incompleteText={"취소"}
        handleToggleOff={onCloseDeleteModal}
        onCompleteCheck={onCompleteDeleteRepeatDdudu}
      />
    </>
  );
}

export default RepeatDduduListView;
