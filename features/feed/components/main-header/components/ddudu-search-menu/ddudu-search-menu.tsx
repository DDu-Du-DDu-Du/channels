import { Pressable } from "react-native";

import { useThemeColorToken } from "@/hooks/use-theme-color";
import { SearchIcon } from "@/icons";

import { useRouter } from "expo-router";

function DDuDuSearchMenu() {
  const router = useRouter();
  const iconStroke = useThemeColorToken("ui.icon.default");

  const handlePressDDuDuSearchMenu = () => {
    router.push("/ddudu");
  };

  return (
    <Pressable
      onPress={handlePressDDuDuSearchMenu}
      hitSlop={8}
    >
      <SearchIcon
        size={24}
        stroke={iconStroke}
      />
    </Pressable>
  );
}

export default DDuDuSearchMenu;
