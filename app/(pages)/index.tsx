import { View } from "react-native";

import { SpoqaText } from "@/components";

import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true" ? (
        <Link href="/(storybook)">Open Storybook</Link>
      ) : (
        <>
          <SpoqaText weight="bold">Hello World (storybook disabled)</SpoqaText>
          <SpoqaText weight="semiBold">Hello World (storybook disabled)</SpoqaText>
          <SpoqaText weight="medium">Hello World (storybook disabled)</SpoqaText>
          <SpoqaText weight="regular">Hello World (storybook disabled)</SpoqaText>
          <SpoqaText weight="thin">Hello World (storybook disabled)</SpoqaText>
        </>
      )}
    </View>
  );
}
