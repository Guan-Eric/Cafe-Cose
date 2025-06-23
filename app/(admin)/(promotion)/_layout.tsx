import { Stack } from 'expo-router';

export default function PromotionLayout() {
  return (
    <Stack initialRouteName="PromotionScreen">
      <Stack.Screen
        name="PromotionScreen"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="CreatePromotionScreen" options={{ headerShown: false }} />
      <Stack.Screen name="EditPromotionScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
