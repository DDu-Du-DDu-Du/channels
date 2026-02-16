import type { DayOfWeekKr } from "@/types/common/day-of-week";

import { GoalPrivacyType } from "../../response/goal/goal";
import { RepeatDduduRequestType } from "../repeat-ddudu/repeat-ddudu";

export interface GoalRepeatDduduRequestType extends Omit<
  RepeatDduduRequestType,
  "repeatDaysOfWeek"
> {
  repeatDaysOfWeek?: DayOfWeekKr[];
}

export interface GoalRequestType {
  name: string;
  color: string;
  privacyType: GoalPrivacyType;
  repeatDdudus?: GoalRepeatDduduRequestType[];
}

export type GoalEditRequestType = Omit<GoalRequestType, "repeatDdudus">;

export interface GoalTerminateRequestType {
  status: "DONE";
}
