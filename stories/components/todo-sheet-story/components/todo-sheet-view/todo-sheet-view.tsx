import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { SpoqaText, Todosheet } from "@/components";
import type { TodoDetailType } from "@/components/todo-sheet/todo-sheet.types";
import { FEED_KEY } from "@/constants/query-key/query-key";
import { formatDateToYYYYMMDD } from "@/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface TodosheetViewProps {
  type?: "Todo" | "schedule";
  TodoId?: number;
  handleEditTodo?: (id: number) => void;
  onDeleteTodo?: (id: number) => void;
  handleTodosheetToggleOff?: () => void;
  handleSelectDifferentDate?: (type: "change" | "repeat", currentDate: string) => void;
  handleAlarmSetting?: () => void;
  handleTodoTimeSetting?: (beginAt?: string, endAt?: string) => void;
  onRepeatCurrentDate?: () => void;
  onChangeCurrentDate?: () => void;
}

function TodosheetView({
  type = "Todo",
  TodoId = 1,
  handleEditTodo,
  onDeleteTodo,
  handleTodosheetToggleOff,
  handleSelectDifferentDate,
  handleAlarmSetting,
  handleTodoTimeSetting,
  onRepeatCurrentDate,
  onChangeCurrentDate,
}: TodosheetViewProps) {
  const [open, setOpen] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const detail: TodoDetailType = {
      id: TodoId,
      name: "Sample",
      status: "UNCOMPLETED",
      goalId: 1,
      repeatTodoId: 0,
      scheduledOn: formatDateToYYYYMMDD(new Date()),
      beginAt: null,
      endAt: null,
    };
    queryClient.setQueryData([FEED_KEY.Todo_DETAIL, TodoId], detail);
  }, [queryClient, TodoId]);

  return (
    <View className="flex-1 items-center justify-center p-4">
      {!open ? (
        <Pressable
          onPress={() => setOpen(true)}
          className="px-4 py-2 bg-role-surface-muted dark:bg-role-dark-surface-muted rounded-radius10"
        >
          <SpoqaText className="text-role-text-inverse dark:text-role-dark-text-inverse">
            Open Todosheet
          </SpoqaText>
        </Pressable>
      ) : (
        <QueryClientProvider client={queryClient}>
          <Todosheet
            type={type}
            TodoId={TodoId}
            handleEditTodo={(id) => handleEditTodo?.(id)}
            onDeleteTodo={(id) => onDeleteTodo?.(id)}
            handleTodosheetToggleOff={() => {
              handleTodosheetToggleOff?.();
              setOpen(false);
            }}
            handleSelectDifferentDate={(t, d) => handleSelectDifferentDate?.(t, d)}
            handleAlarmSetting={() => handleAlarmSetting?.()}
            handleTodoTimeSetting={(b?, e?) => handleTodoTimeSetting?.(b, e)}
            onRepeatCurrentDate={() => onRepeatCurrentDate?.()}
            onChangeCurrentDate={() => onChangeCurrentDate?.()}
          />
        </QueryClientProvider>
      )}
    </View>
  );
}

export default TodosheetView;
