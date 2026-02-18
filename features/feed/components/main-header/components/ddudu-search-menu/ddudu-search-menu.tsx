import { Pressable } from "react-native";

import { SearchIcon } from "@/icons";

import { useRouter } from "expo-router";

function DDuDuSearchMenu() {
  const router = useRouter();

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
        stroke="#FFFFFF"
      />
    </Pressable>
  );
}

export default DDuDuSearchMenu;
