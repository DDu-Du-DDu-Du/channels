import type { SubmitHandler, UseFormReset } from "react-hook-form";

import { FEED_KEY } from "@/constants/query-key/query-key";
import { fetchCreateTodo, fetchEditTodo } from "@/service/feed/feed";
import type { MainTodosType } from "@/types/response/feed/feed";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TodoInputType } from "../../main-todo-input.types";

interface UseUpdateTodoMutationProps {
  type: "create" | "edit";
  selectedTodoDate: string;
  goalId: number;
  TodoItem?: MainTodosType;
  reset: UseFormReset<TodoInputType>;
  onCloseTodoInput: () => void;
}

const useUpdateTodoMutation = ({
  type,
  selectedTodoDate,
  goalId,
  TodoItem,
  reset,
  onCloseTodoInput,
}: UseUpdateTodoMutationProps) => {
  const queryClient = useQueryClient();

  const onUpdateSuccess = () => {
    reset();
    onCloseTodoInput();
    queryClient.refetchQueries({ queryKey: [FEED_KEY.MONTHLY_Todos] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.WEEKLY_Todos] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_LIST, selectedTodoDate] });
    queryClient.refetchQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE, selectedTodoDate] });
  };

  const createTodoMutation = useMutation({
    mutationKey: [FEED_KEY.CREATE_Todo],
    mutationFn: fetchCreateTodo,
    onSuccess: onUpdateSuccess,
  });

  const editTodoMutation = useMutation({
    mutationKey: [FEED_KEY.EDIT_Todo],
    mutationFn: fetchEditTodo,
    onSuccess: onUpdateSuccess,
  });

  const onValid: SubmitHandler<TodoInputType> = ({ Todo }) => {
    if (createTodoMutation.isPending || editTodoMutation.isPending) {
      return;
    }

    if (type === "create") {
      createTodoMutation.mutate({
        requestTodo: {
          goalId,
          name: Todo,
          scheduledOn: selectedTodoDate,
        },
      });
    } else if (type === "edit" && TodoItem) {
      editTodoMutation.mutate({
        id: TodoItem.id,
        requestTodo: {
          goalId,
          name: Todo,
          scheduledOn: selectedTodoDate,
        },
      });
    }
  };

  return {
    onValid,
    isPending: createTodoMutation.isPending || editTodoMutation.isPending,
  };
};

export default useUpdateTodoMutation;
