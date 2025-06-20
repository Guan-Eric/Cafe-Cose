import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="PromotionScreen" options={{ headerShown: false, animation: 'fade' }} />
    </Stack>
  );
}
