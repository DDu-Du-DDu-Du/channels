import type { RepeatTodoRequestType } from "@/types/request/repeat-todo/repeat-todo";

export interface RepeatTodoItemType extends RepeatTodoRequestType {
  id?: number;
  tempId?: string;
}
