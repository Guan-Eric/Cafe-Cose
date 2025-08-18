import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="PromotionScreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="OnboardingScreen" options={{ headerShown: false, animation: 'fade' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
