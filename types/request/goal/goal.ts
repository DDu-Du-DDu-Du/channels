import { GoalPrivacyType } from "../../response/goal/goal";
import { RepeatDduduRequestType } from "../repeat-ddudu/repeat-ddudu";

export interface GoalRequestType {
  name: string;
  color: string;
  privacyType: GoalPrivacyType;
  repeatDdudus?: RepeatDduduRequestType[];
}
