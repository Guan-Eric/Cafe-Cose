import { StatusBar } from 'react-native';
import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
