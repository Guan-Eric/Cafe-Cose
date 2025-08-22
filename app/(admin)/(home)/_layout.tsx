import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="QRScannerScreen" options={{ headerShown: false }} />
      <Stack.Screen name="PromotionScreen" options={{ headerShown: false }} />
      <Stack.Screen name="CreatePromotionScreen" options={{ headerShown: false }} />
      <Stack.Screen name="EditPromotionScreen" options={{ headerShown: false }} />
      <Stack.Screen name="FeedbackScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ViewFeedbackScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ViewOpeningHoursScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
