import { Stack } from 'expo-router';

export default function InformationLayout() {
  return (
    <Stack initialRouteName="InformationScreen">
      <Stack.Screen
        name="InformationScreen"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}
