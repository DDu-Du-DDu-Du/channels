import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";

function ConnectionActionButtons() {
  return (
    <View className="flex-row gap-[0.6rem]">
      <Pressable className="h-[3.2rem] items-center justify-center rounded-radius10 border border-role-border-default dark:border-role-dark-border-default bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[0.9rem]">
        <SpoqaText className="text-size12 text-role-text-primary dark:text-role-dark-text-primary">
          Import
        </SpoqaText>
      </Pressable>
      <Pressable className="h-[3.2rem] items-center justify-center rounded-radius10 border border-role-border-default dark:border-role-dark-border-default bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[0.9rem]">
        <SpoqaText className="text-size12 text-role-text-primary dark:text-role-dark-text-primary">
          Export
        </SpoqaText>
      </Pressable>
    </View>
  );
}

export default ConnectionActionButtons;
