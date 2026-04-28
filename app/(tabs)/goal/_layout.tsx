import { Stack } from "expo-router";

function GoalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="editor" />
    </Stack>
  );
}

export default GoalLayout;
