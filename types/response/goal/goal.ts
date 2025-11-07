import { RepeatDdudusType } from "@/types/response/repeat-ddudu/repeat-ddudu";

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
  repeatDdudus: RepeatDdudusType[];
}

export type GoalPrivacyType = "PUBLIC" | "FOLLOWER" | "PRIVATE";
