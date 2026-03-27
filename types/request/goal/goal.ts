import type { DayOfWeekKr } from "@/types/common/day-of-week";

import { GoalPrivacyType } from "../../response/goal/goal";
import { RepeatTodoRequestType } from "../repeat-todo/repeat-todo";

export interface GoalRepeatTodoRequestType extends Omit<RepeatTodoRequestType, "repeatDaysOfWeek"> {
  repeatDaysOfWeek?: DayOfWeekKr[];
}

export interface GoalRequestType {
  name: string;
  color: string;
  privacyType: GoalPrivacyType;
  repeatTodos?: GoalRepeatTodoRequestType[];
}

export type GoalEditRequestType = Omit<GoalRequestType, "repeatTodos">;

export interface GoalTerminateRequestType {
  status: "DONE";
}
