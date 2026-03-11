import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { ArrowLeftIcon, CreateIcon } from "@/icons";

import { useRouter } from "expo-router";

function GoalHeader() {
  const router = useRouter();

  const handlePressBack = () => {
    router.push("/feed");
  };

  const handlePressCreate = () => {
    router.push("/goal/create");
  };

  return (
    <View className="px-[2.4rem] pb-[1.6rem] pt-[2.4rem]">
      <View className="relative items-center justify-center">
        <Pressable
          onPress={handlePressBack}
          className="absolute left-0 top-0 size-[2.4rem] items-start justify-center"
          hitSlop={8}
        >
          <ArrowLeftIcon
            size={16}
            stroke="#FFFFFF"
          />
        </Pressable>
        <SpoqaText
          weight="bold"
          className="text-size15 text-role-text-inverse dark:text-role-dark-text-inverse"
        >
          Goals
        </SpoqaText>
        <Pressable
          onPress={handlePressCreate}
          className="absolute right-0 top-0 size-[2.4rem] items-end justify-center"
          hitSlop={8}
        >
          <CreateIcon
            size={18}
            fill="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );
}

export default GoalHeader;
