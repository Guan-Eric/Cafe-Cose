import { Stack } from 'expo-router';

export default function AnnouncementLayout() {
  return (
    <Stack initialRouteName="AnnouncementScreen">
      <Stack.Screen
        name="AnnouncementScreen"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="CreateAnnouncementScreen" options={{ headerShown: false }} />
      <Stack.Screen name="EditAnnouncementScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
