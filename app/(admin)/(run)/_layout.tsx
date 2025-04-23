import { Stack } from 'expo-router';

export default function RunLayout() {
  return (
    <Stack initialRouteName="RunScreen">
      <Stack.Screen name="RunScreen" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="CreateRunScreen" options={{ headerShown: false }} />
      <Stack.Screen name="EditRunScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
