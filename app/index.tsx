import { Image, View } from 'react-native';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useEffect, useState } from 'react';
import { getUser } from 'backend/user';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user && (await getUser(FIREBASE_AUTH.currentUser?.uid as string))?.admin) {
        router.replace('/(admin)/(home)/HomeScreen');
      } else if (user) {
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
        <Image source={{ uri: '../assets/logo.png' }} className="w-200 h-32" resizeMode="contain" />
      </View>
    );
  }

  return null;
}
