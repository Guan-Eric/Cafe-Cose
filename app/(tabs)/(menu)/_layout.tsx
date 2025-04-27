import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack initialRouteName="MenuScreen">
      <Stack.Screen name="MenuScreen" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="ViewMenuItem" options={{ headerShown: false }} />
    </Stack>
  );
}
