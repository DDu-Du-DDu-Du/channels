import { useEffect, useRef } from "react";
import { Pressable } from "react-native";

import { GoalSelectSheet } from "@/features/goal";
import { useToggle } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { AddListIcon } from "@/icons";

import { useLocalSearchParams, useRouter } from "expo-router";

const toSingleParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

function GoalMenu() {
  const router = useRouter();
  const params = useLocalSearchParams<{ openGoalSheet?: string | string[] }>();
  const iconFill = useThemeColorToken("ui.icon.default");
  const hasConsumedOpenParamRef = useRef(false);
  const {
    isToggle: isGoalSheetOpen,
    handleToggleOn: handleGoalSheetOpen,
    handleToggleOff: handleGoalSheetClose,
  } = useToggle();

  useEffect(() => {
    if (toSingleParam(params.openGoalSheet) !== "1" || hasConsumedOpenParamRef.current) {
      return;
    }

    hasConsumedOpenParamRef.current = true;
    handleGoalSheetOpen();
    router.replace("/feed");
  }, [handleGoalSheetOpen, params.openGoalSheet, router]);

  const handlePressGoalMenu = () => {
    handleGoalSheetOpen();
  };

  const handlePressAdd = () => {
    router.push({
      pathname: "/goal/create",
      params: {
        returnTo: "/feed",
        openGoalSheet: "1",
      },
    });
  };

  return (
    <>
      <Pressable
        onPress={handlePressGoalMenu}
        hitSlop={8}
      >
        <AddListIcon fill={iconFill} />
      </Pressable>

      {isGoalSheetOpen && (
        <GoalSelectSheet
          onClose={handleGoalSheetClose}
          onPressAdd={handlePressAdd}
        />
      )}
    </>
  );
}

export default GoalMenu;
