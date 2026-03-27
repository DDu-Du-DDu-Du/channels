import { Pressable, View } from "react-native";

import PageHeader from "@/components/page-header/page-header";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { CreateIcon } from "@/icons";

import { useRouter } from "expo-router";

function GoalHeader() {
  const router = useRouter();
  const iconFill = useThemeColorToken("ui.icon.default");

  const handlePressBack = () => {
    router.push("/feed");
  };

  const handlePressCreate = () => {
    router.push("/goal/create");
  };

  return (
    <View>
      <PageHeader
        title="Goals"
        onPressBack={handlePressBack}
        rightContent={
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
        }
      />
    </View>
  );
}

export default GoalHeader;
