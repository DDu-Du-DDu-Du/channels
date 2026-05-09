import { RepeatTodosType } from "@/types/response/repeat-todo/repeat-todo";

export interface GoalType {
  id: number;
  name: string;
  status: "IN_PROGRESS" | "DONE";
  color: string;
  priority: number;
}

export interface GoalDetailType {
  id: number;
  name: string;
  status: "IN_PROGRESS" | "DONE";
  color: string;
  priority: number;
  privacyType: GoalPrivacyType;
  repeatTodos: RepeatTodosType[];
}

export type GoalDetailResponseType = GoalDetailType;

export type GoalPrivacyType = "PUBLIC" | "FOLLOWER" | "PRIVATE";
