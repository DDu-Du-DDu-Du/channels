import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{ title: "Home" }}
      />
      <Tabs.Screen
        name="feed/index"
        initialParams={{ view: "ddudu" }}
        options={{ title: "Feed" }}
      />
    </Tabs>
  );
}
