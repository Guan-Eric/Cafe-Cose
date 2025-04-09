import { Stack } from 'expo-router';

export default function QRLayout() {
  return (
    <Stack initialRouteName="QRCodeScreen">
      <Stack.Screen name="QRCodeScreen" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}
