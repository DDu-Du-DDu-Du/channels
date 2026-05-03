import { useState } from "react";

export type FeedWideDetailMode =
  | { type: "feed" }
  | { type: "goal-create" }
  | { type: "goal-edit"; goalId: number };

function useFeedWideState() {
  const [selectedGoalIds, setSelectedGoalIds] = useState<number[]>([]);
  const [detailMode, setDetailMode] = useState<FeedWideDetailMode>({ type: "feed" });

  const handleToggleGoal = (goalId: number) => {
    setSelectedGoalIds((previousGoalIds) => {
      if (previousGoalIds.includes(goalId)) {
        return previousGoalIds.filter((id) => id !== goalId);
      }

      return [...previousGoalIds, goalId];
    });
    setDetailMode({ type: "feed" });
  };

  const handleClearGoalSelection = () => {
    setSelectedGoalIds([]);
    setDetailMode({ type: "feed" });
  };

  const handleOpenGoalCreate = () => {
    setDetailMode({ type: "goal-create" });
  };

  const handleOpenGoalEdit = (goalId: number) => {
    setDetailMode({ type: "goal-edit", goalId });
  };

  const handleOpenFeedDetail = () => {
    setDetailMode({ type: "feed" });
  };

  return {
    selectedGoalIds,
    detailMode,
    handleToggleGoal,
    handleClearGoalSelection,
    handleOpenGoalCreate,
    handleOpenGoalEdit,
    handleOpenFeedDetail,
  };
}

export default useFeedWideState;
