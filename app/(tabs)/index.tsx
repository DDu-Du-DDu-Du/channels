import { View } from "react-native";

import { SpoqaText } from "@/components";

import { Link } from "expo-router";

export default function Tabs() {
  return (
    <View className="flex-1">
      {process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true" ? (
        <View className="flex-1 items-center justify-center">
          <Link href="/(storybook)">Open Storybook</Link>
        </View>
      ) : (
        <>
          <View className="flex-1 items-center justify-center">
            <SpoqaText weight="bold">Hello World (storybook disabled)</SpoqaText>
            <SpoqaText weight="semiBold">Hello World (storybook disabled)</SpoqaText>
            <SpoqaText weight="medium">Hello World (storybook disabled)</SpoqaText>
            <SpoqaText weight="regular">Hello World (storybook disabled)</SpoqaText>
            <SpoqaText weight="thin">Hello World (storybook disabled)</SpoqaText>
          </View>
        </>
      )}
    </View>
  );
}
