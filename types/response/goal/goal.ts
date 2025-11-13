import { RepeatDDuDusType } from "@/types/response/repeat-ddudu/repeat-ddudu";

export interface GoalType {
  id: number;
  name: string;
  status: "IN_PROGRESS" | "DONE";
  color: string;
}

export interface GoalDetailType {
  id: number;
  name: string;
  status: "IN_PROGRESS" | "DONE";
  color: string;
  privacyType: GoalPrivacyType;
  repeatDdudus: RepeatDDuDusType[];
}

export type GoalPrivacyType = "PUBLIC" | "FOLLOWER" | "PRIVATE";
