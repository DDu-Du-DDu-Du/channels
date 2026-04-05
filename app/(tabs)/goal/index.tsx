import { Pressable, View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { GoalList } from "@/features/goal";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { CreateIcon } from "@/icons";

import { useRouter } from "expo-router";

function Goal() {
  const router = useRouter();
  const iconFill = useThemeColorToken("ui.icon.default");

  const handlePressCreate = () => {
    router.push("/goal/create");
  };

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="Goals"
        onPressBack={() => router.push("/feed")}
        rightContent={<HeaderRightActions />}
        className="px-[2.4rem] pb-[1.6rem] pt-[2rem]"
      />
      <View className="items-end px-[2.4rem] py-[0.8rem]">
        <Pressable
          onPress={handlePressCreate}
          className="size-[2.4rem] items-end justify-center"
          hitSlop={8}
        >
          <CreateIcon
            size={18}
            fill={iconFill}
          />
        </Pressable>
      </View>
      <GoalList />
    </View>
  );
}

export default Goal;
