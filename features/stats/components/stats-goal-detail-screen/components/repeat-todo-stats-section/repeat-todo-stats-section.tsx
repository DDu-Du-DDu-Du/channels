import { useMemo, useState } from "react";
import { View } from "react-native";

import { SpoqaText } from "@/components";
import { useToast } from "@/components/toast/hooks";
import {
  RepeatTodoItemType,
  RepeatTodosheet,
  useRepeatSheet,
  useRepeatTodoMutation,
} from "@/features/repeat-todo";
import { RepeatTodoRequestType } from "@/types/request/repeat-todo/repeat-todo";
import { StatsDetailRepeatTodoItemType } from "@/types/response/stats/stats";

import RepeatTodoBarRow from "../repeat-todo-bar-row/repeat-todo-bar-row";

interface RepeatTodostatsSectionProps {
  goalId: number;
  repeatTodostats?: StatsDetailRepeatTodoItemType[];
  repeatTodoItems?: RepeatTodoItemType[];
  goalColor: string;
}

function RepeatTodostatsSection({
  goalId,
  repeatTodostats = [],
  repeatTodoItems = [],
  goalColor,
}: RepeatTodostatsSectionProps) {
  const { createToast } = useToast();
  const { ref, closeSheet, handlePressOpenRepeatSheet } = useRepeatSheet();
  const { handleEditRepeatTodo } = useRepeatTodoMutation({ goalId });

  const [selectedRepeatTodo, setSelectedRepeatTodo] = useState<RepeatTodoItemType>();

  const sorted = useMemo(
    () => [...repeatTodostats].sort((a, b) => b.completedCount - a.completedCount),
    [repeatTodostats],
  );

  const maxCount = Math.max(...sorted.map((item) => item.completedCount), 0);

  const handlePressRow = (item: StatsDetailRepeatTodoItemType) => {
    const matched = repeatTodoItems.find((repeatTodo) => repeatTodo?.id === item.repeatTodoId);

    if (!matched) {
      createToast("반복투두 상세를 불러오지 못했어요", { type: "danger" });
      return;
    }

    setSelectedRepeatTodo(matched);
    handlePressOpenRepeatSheet();
  };

  const handleCloseRepeatSheet = () => {
    closeSheet();
    setSelectedRepeatTodo(undefined);
  };

  const handleSubmitRepeatTodo = (repeatTodo: RepeatTodoRequestType) => {
    if (!selectedRepeatTodo?.id) {
      createToast("반복투두를 수정할 수 없어요", { type: "danger" });
      return;
    }

    handleEditRepeatTodo(selectedRepeatTodo.id, { ...repeatTodo });
  };

  return (
    <>
      <View className="mt-[1.2rem] rounded-radius15 bg-role-surface-panel dark:bg-role-dark-surface-panel px-[1.4rem] py-[1.4rem]">
        <View className="items-center">
          <View className="rounded-circle bg-role-surface-panel dark:bg-role-dark-surface-panel px-[1.2rem] py-[0.5rem]">
            <SpoqaText
              weight="semiBold"
              className="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
            >
              반복투두
            </SpoqaText>
          </View>
        </View>

        <View className="mt-[1.2rem] border-t border-role-border-default dark:border-role-dark-border-default pt-[1rem]">
          {sorted.length === 0 ? (
            <SpoqaText className="text-center text-size13 text-role-text-tertiary dark:text-role-dark-text-tertiary">
              데이터가 없어요
            </SpoqaText>
          ) : (
            <View className="gap-[0.9rem]">
              {sorted.map((item, index) => {
                const ratio = maxCount > 0 ? item.completedCount / maxCount : 0;
                const widthPercent = Math.max(20, Math.min(100, ratio * 100));
                const opacityStep = sorted.length > 1 ? index / (sorted.length - 1) : 0;
                const opacity = Math.max(0.5, 1 - opacityStep * 0.5);

                return (
                  <RepeatTodoBarRow
                    key={`repeat-${item.repeatTodoId}`}
                    item={item}
                    widthPercent={widthPercent}
                    opacity={opacity}
                    goalColor={goalColor}
                    onPress={handlePressRow}
                  />
                );
              })}
            </View>
          )}
        </View>
      </View>

      <RepeatTodosheet
        bottomSheetRef={ref}
        onClose={handleCloseRepeatSheet}
        onDismiss={() => setSelectedRepeatTodo(undefined)}
        repeatTodo={selectedRepeatTodo}
        sheetTitle="반복 수정"
        submitLabel="반복 수정"
        onSubmit={handleSubmitRepeatTodo}
      />
    </>
  );
}

export type { RepeatTodostatsSectionProps };
export default RepeatTodostatsSection;
