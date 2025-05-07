import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen
        name="ViewAnnouncementScreen"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="QRCodeScreen" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="SettingsScreen" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}
