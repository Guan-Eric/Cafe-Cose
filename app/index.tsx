import { Image, View } from 'react-native';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useEffect, useState } from 'react';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        router.replace('/(tabs)/(home)/HomeScreen');
      } else {
        router.replace('/(auth)/WelcomeScreen');
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#181818]">
        <Image
          source={{ uri: '../assets/icon.png' }}
          className="h-32 w-32" // adjust size as needed
          resizeMode="contain"
        />
      </View>
    );
  }

  return null;
}
