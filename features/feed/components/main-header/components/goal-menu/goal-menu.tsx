import { Pressable } from "react-native";

import { useThemeColorToken } from "@/hooks/use-theme-color";
import { AddListIcon } from "@/icons";

import { useRouter } from "expo-router";

function GoalMenu() {
  const router = useRouter();
  const iconFill = useThemeColorToken("ui.icon.default");

  const handlePressGoalMenu = () => {
    router.push("/goal");
  };

  return (
    <Pressable
      onPress={handlePressGoalMenu}
      hitSlop={8}
    >
      <AddListIcon fill={iconFill} />
    </Pressable>
  );
}

export default GoalMenu;
