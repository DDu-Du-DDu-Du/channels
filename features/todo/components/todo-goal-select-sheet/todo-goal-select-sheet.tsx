import { useEffect } from "react";
import { View } from "react-native";

import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import FormHeader from "@/components/form-header/form-header";
import { GoalList } from "@/features/goal";
import { useBottomSheetAction } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import type { GoalType } from "@/types/response/goal/goal";

export interface TodoGoalSelectSheetProps {
  onClose: () => void;
  onSelectGoal: (goal: GoalType) => void;
}

function TodoGoalSelectSheet({ onClose, onSelectGoal }: TodoGoalSelectSheetProps) {
  const iconStroke = useThemeColorToken("ui.icon.default");
  const { ref, openSheet, closeSheet } = useBottomSheetAction();

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  const handleClose = () => {
    closeSheet();
    onClose();
  };

  return (
    <BottomSheet
      ref={ref}
      onClose={onClose}
      fitContent
      maxHeight="90%"
    >
      <View className="w-full min-h-0 bg-role-surface-panel dark:bg-role-dark-surface-panel">
        <FormHeader
          title="목표 목록"
          onPressBack={handleClose}
          titleClassName="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
          iconStroke={iconStroke}
          className="px-[2.4rem] pb-[1.2rem] pt-[1.6rem]"
        />

        <GoalList
          onPressGoal={(goal) => {
            onSelectGoal(goal);
            handleClose();
          }}
          onlyInProgress
        />
      </View>
    </BottomSheet>
  );
}

export default TodoGoalSelectSheet;
