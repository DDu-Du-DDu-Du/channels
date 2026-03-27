import { Pressable } from "react-native";

import { useThemeColorToken } from "@/hooks/use-theme-color";
import { SearchIcon } from "@/icons";

import { useRouter } from "expo-router";

function TodoSearchMenu() {
  const router = useRouter();
  const iconStroke = useThemeColorToken("ui.icon.default");

  const handlePressTodoSearchMenu = () => {
    router.push("/todo" as any);
  };

  return (
    <Pressable
      onPress={handlePressTodoSearchMenu}
      hitSlop={8}
    >
      <SearchIcon
        size={24}
        stroke={iconStroke}
      />
    </Pressable>
  );
}

export default TodoSearchMenu;
