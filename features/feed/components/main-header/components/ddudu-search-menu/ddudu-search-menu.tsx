import { Pressable } from "react-native";

import { SearchIcon } from "@/icons";

function DDuDuSearchMenu() {
  const handlePressDDuDuSearchMenu = () => {};

  return (
    <Pressable
      onPress={handlePressDDuDuSearchMenu}
      hitSlop={8}
    >
      <SearchIcon
        size={24}
        stroke="#FFFFFF"
      />
    </Pressable>
  );
}

export default DDuDuSearchMenu;
