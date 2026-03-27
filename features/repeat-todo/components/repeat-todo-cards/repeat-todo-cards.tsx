import { FlatList, View } from "react-native";

import type { RepeatTodoItemType } from "@/features/repeat-todo/repeat-todo.types";

import SwipeableRepeatTodoCard from "../swipeable-repeat-todo-card/swipeable-repeat-todo-card";

export interface RepeatTodoCardsProps {
  repeatTodos: RepeatTodoItemType[];
  onPressRepeatTodo?: (index: number) => void;
  onPressDeleteRepeatTodo?: (item: RepeatTodoItemType, index: number) => void;
}

function RepeatTodoCards({
  repeatTodos,
  onPressRepeatTodo,
  onPressDeleteRepeatTodo,
}: RepeatTodoCardsProps) {
  if (!repeatTodos.length) {
    return null;
  }

  return (
    <View className="flex-1">
      <FlatList
        data={repeatTodos}
        keyExtractor={(item, index) =>
          item.id?.toString() ?? item.tempId ?? `${item.name}-${index}`
        }
        contentContainerStyle={{ rowGap: 8 }}
        renderItem={({ item, index }) => (
          <SwipeableRepeatTodoCard
            repeatTodo={item}
            onPress={() => onPressRepeatTodo?.(index)}
            onPressDelete={() => onPressDeleteRepeatTodo?.(item, index)}
          />
        )}
      />
    </View>
  );
}

export default RepeatTodoCards;
