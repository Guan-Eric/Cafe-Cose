import { Stack } from 'expo-router';

export default function AnnouncementLayout() {
  return (
    <Stack initialRouteName="AnnouncementScreen">
      <Stack.Screen
        name="AnnouncementScreen"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="ViewAnnouncementScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
