import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, View } from "react-native";

import { FormTextInput } from "@/components";
import { OptionIcon } from "@/icons";
import type { MainTodosType } from "@/types/response/feed/feed";

import { useUpdateTodoMutation } from "./hooks";
import type { TodoInputType } from "./main-todo-input.types";

interface MainTodoInputProps {
  type?: "create" | "edit";
  goalId: number;
  color: string;
  TodoItem?: MainTodosType;
  selectedTodoDate: string;
  onCloseTodoInput: () => void;
}

function MainTodoInput({
  type = "create",
  goalId,
  color,
  TodoItem,
  selectedTodoDate,
  onCloseTodoInput,
}: MainTodoInputProps) {
  const { control, handleSubmit, reset } = useForm<TodoInputType>({
    defaultValues: { Todo: TodoItem?.name ?? "" },
  });

  useEffect(() => {
    reset({ Todo: TodoItem?.name ?? "" });
  }, [TodoItem?.name, reset]);

  const { onValid, isPending } = useUpdateTodoMutation({
    type,
    goalId,
    TodoItem,
    selectedTodoDate,
    reset,
    onCloseTodoInput,
  });

  const isSubmittingRef = useRef(false);
  const handleSubmitForm = handleSubmit(onValid, () => onCloseTodoInput());
  const handleSubmitOnce = () => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    Promise.resolve(handleSubmitForm()).finally(() => {
      isSubmittingRef.current = false;
    });
  };

  return (
    <View className="flex-row items-center justify-between">
      <View
        className="w-[2rem] h-[2rem] rounded-circle border-2 bg-role-surface-canvas dark:bg-role-dark-surface-canvas mr-[1rem]"
        style={{ borderColor: `#${color}` }}
      />
      <View className="flex-1">
        <FormTextInput<TodoInputType>
          control={control}
          name="Todo"
          required
          rules={{ required: true }}
          placeholder="Add a Todo"
          autoFocus
          className="w-full py-[0.5rem] px-[0.5rem] border-b"
          style={{
            borderWidth: 0,
            borderBottomWidth: 1,
            borderColor: `#${color}`,
            borderRadius: 0,
            backgroundColor: "transparent",
            height: 36,
          }}
          returnKeyType="done"
          onSubmitEditing={handleSubmitOnce}
          editable={!isPending}
          showErrorMessage={false}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        className="ml-[0.5rem] p-[0.5rem] pr-[0]"
        onPress={handleSubmitOnce}
        disabled={isPending}
      >
        {isPending ? <ActivityIndicator /> : <OptionIcon />}
      </Pressable>
    </View>
  );
}

export default MainTodoInput;
