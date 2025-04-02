import React from 'react';
import { Stack } from 'expo-router';

function LoginStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="WelcomeScreen"
        options={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'none',
          navigationBarHidden: true,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />

      <Stack.Screen name="SignInScreen" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="SignUpScreen" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}

export default LoginStackLayout;
