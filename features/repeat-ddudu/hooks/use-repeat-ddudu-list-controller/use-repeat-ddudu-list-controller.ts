import { useState } from "react";

import type { RepeatDduduItemType } from "@/features/repeat-ddudu/repeat-ddudu.types";
import { useToggle } from "@/hooks";

interface UseRepeatDduduListControllerProps {
  onDeleteRepeatDdudu: (repeatDduduId: number) => void;
}

function useRepeatDduduListController({ onDeleteRepeatDdudu }: UseRepeatDduduListControllerProps) {
  const { isToggle, handleToggleOn, handleToggleOff } = useToggle();
  const [selectedRepeatDdudu, setSelectedRepeatDdudu] = useState<RepeatDduduItemType>();
  const [targetDeleteRepeatDduduId, setTargetDeleteRepeatDduduId] = useState<number>();

  const handlePressRepeatDdudu = (repeatDdudu: RepeatDduduItemType) => {
    setSelectedRepeatDdudu(repeatDdudu);
  };

  const handleClearSelectedRepeatDdudu = () => {
    setSelectedRepeatDdudu(undefined);
  };

  const handlePressDeleteRepeatDdudu = (repeatDduduId?: number) => {
    if (!repeatDduduId) {
      return;
    }

    setTargetDeleteRepeatDduduId(repeatDduduId);
    handleToggleOn();
  };

  const handleCompleteDeleteRepeatDdudu = (isComplete: boolean) => {
    if (!isComplete || !targetDeleteRepeatDduduId) {
      return;
    }

    onDeleteRepeatDdudu(targetDeleteRepeatDduduId);
    setTargetDeleteRepeatDduduId(undefined);
  };

  const handleCloseDeleteModal = () => {
    setTargetDeleteRepeatDduduId(undefined);
    handleToggleOff();
  };

  return {
    isDeleteConfirmOpen: isToggle,
    selectedRepeatDdudu,
    handlePressRepeatDdudu,
    handleClearSelectedRepeatDdudu,
    handlePressDeleteRepeatDdudu,
    handleCompleteDeleteRepeatDdudu,
    handleCloseDeleteModal,
  };
}

export default useRepeatDduduListController;
