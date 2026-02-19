import { MainHeader } from "@/components";

import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="feed/index"
      screenOptions={{
        headerShown: true,
        header: () => <MainHeader />,
      }}
    >
      <Tabs.Screen
        name="feed/index"
        initialParams={{ view: "list" }}
        options={{ title: "Feed" }}
      />
      <Tabs.Screen
        name="stats/index"
        options={{ title: "Stats" }}
      />
    </Tabs>
  );
}
