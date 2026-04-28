import { Stack } from "expo-router";

function AnnouncementLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}

export default AnnouncementLayout;
