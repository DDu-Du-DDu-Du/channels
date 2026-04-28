import { Stack } from "expo-router";

function StatsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="select" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}

export default StatsLayout;
