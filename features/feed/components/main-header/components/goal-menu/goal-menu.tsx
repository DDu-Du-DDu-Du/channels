import { Pressable } from "react-native";

import { AddListIcon } from "@/icons";

import { useRouter } from "expo-router";

function GoalMenu() {
  const router = useRouter();

  const handlePressGoalMenu = () => {
    router.push("/goal");
  };

  return (
    <Pressable
      onPress={handlePressGoalMenu}
      hitSlop={8}
    >
      <AddListIcon fill="#FFFFFF" />
    </Pressable>
  );
}

export default GoalMenu;
