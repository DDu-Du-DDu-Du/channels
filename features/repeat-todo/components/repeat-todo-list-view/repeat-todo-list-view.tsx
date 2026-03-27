import { FlatList, Pressable, View } from "react-native";

import { ConfirmModal, EmptyList, FormHeader } from "@/components";
import type { RepeatTodoItemType } from "@/features/repeat-todo/repeat-todo.types";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { PlusIcon } from "@/icons";

import SwipeableRepeatTodoCard from "../swipeable-repeat-todo-card/swipeable-repeat-todo-card";

export interface RepeatTodoListViewProps {
  repeatTodos: RepeatTodoItemType[];
  onPressBack: () => void;
  onPressAdd: () => void;
  onPressRepeatTodo: (repeatTodo: RepeatTodoItemType) => void;
  onPressDeleteRepeatTodo: (repeatTodoId?: number) => void;
  isDeleteConfirmOpen: boolean;
  onCompleteDeleteRepeatTodo: (isComplete: boolean) => void;
  onCloseDeleteModal: () => void;
}

function RepeatTodoListView({
  repeatTodos,
  onPressBack,
  onPressAdd,
  onPressRepeatTodo,
  onPressDeleteRepeatTodo,
  isDeleteConfirmOpen,
  onCompleteDeleteRepeatTodo,
  onCloseDeleteModal,
}: RepeatTodoListViewProps) {
  const iconFill = useThemeColorToken("ui.icon.default");

  const rightContent = (
    <Pressable
      onPress={onPressAdd}
      className="size-[2.4rem] items-end justify-center"
      hitSlop={8}
    >
      <PlusIcon
        size={14}
        fill={iconFill}
      />
    </Pressable>
  );

  return (
    <>
      <View className="px-[2.4rem] pb-[1.6rem] pt-[2.4rem]">
        <View className="relative">
          <FormHeader
            title={"반복투두"}
            onPressBack={onPressBack}
            className="p-0"
          />
          <View className="absolute right-0 top-0">{rightContent}</View>
        </View>
      </View>

      <FlatList
        data={repeatTodos}
        keyExtractor={(item, index) => `${item.id ?? index}-${item.name}`}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 24,
          rowGap: 12,
          flexGrow: 1,
        }}
        renderItem={({ item }) => (
          <SwipeableRepeatTodoCard
            repeatTodo={item}
            onPress={() => onPressRepeatTodo(item)}
            onPressDelete={() => onPressDeleteRepeatTodo(item.id)}
          />
        )}
        ListEmptyComponent={() => <EmptyList text={"반복투두를 생성해보세요."} />}
      />

      <ConfirmModal
        isToggle={isDeleteConfirmOpen}
        title={"반복투두를 삭제할까요?"}
        message={"삭제 후에는 되돌릴 수 없습니다."}
        completeText={"삭제"}
        incompleteText={"취소"}
        handleToggleOff={onCloseDeleteModal}
        onCompleteCheck={onCompleteDeleteRepeatTodo}
      />
    </>
  );
}

export default RepeatTodoListView;
