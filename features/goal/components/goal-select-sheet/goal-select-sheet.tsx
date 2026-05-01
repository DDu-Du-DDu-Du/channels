import { useEffect } from "react";
import { Pressable, View } from "react-native";

import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import FormHeader from "@/components/form-header/form-header";
import { useBottomSheetAction } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { PlusIcon } from "@/icons";
import type { GoalType } from "@/types/response/goal/goal";

import GoalList from "../goal-list/goal-list";

import { useRouter } from "expo-router";

export interface GoalSelectSheetProps {
  onClose: () => void;
  onPressGoal?: (goal: GoalType) => void;
  onPressAdd?: () => void;
  onlyInProgress?: boolean;
}

function GoalSelectSheet({
  onClose,
  onPressGoal,
  onPressAdd,
  onlyInProgress = false,
}: GoalSelectSheetProps) {
  const router = useRouter();
  const iconStroke = useThemeColorToken("ui.icon.default");
  const { ref, openSheet, closeSheet } = useBottomSheetAction();

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  const handleClose = () => {
    closeSheet();
    onClose();
  };

  const handlePressGoal = (goal: GoalType) => {
    if (onPressGoal) {
      onPressGoal(goal);
      handleClose();
      return;
    }

    handleClose();
    router.push({
      pathname: "/goal/editor",
      params: { goalId: goal.id },
    });
  };

  const handlePressAdd = () => {
    handleClose();

    if (onPressAdd) {
      onPressAdd();
      return;
    }

    router.push("/goal/create");
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
          rightContent={
            <Pressable
              onPress={handlePressAdd}
              className="size-[2.4rem] items-end justify-center"
              hitSlop={8}
            >
              <PlusIcon
                size={16}
                stroke={iconStroke}
              />
            </Pressable>
          }
          titleClassName="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
          iconStroke={iconStroke}
          className="px-[2.4rem] pb-[1.2rem] pt-[1.6rem]"
        />

        <GoalList
          onPressGoal={handlePressGoal}
          onlyInProgress={onlyInProgress}
        />
      </View>
    </BottomSheet>
  );
}

export default GoalSelectSheet;
