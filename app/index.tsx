import { Image, View } from 'react-native';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useEffect, useState } from 'react';
import { getUser } from 'backend/user';

function index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
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
      <View className="flex-1 items-center justify-center bg-background">
        <Image source={{ uri: '../assets/logo.png' }} className="w-200 h-32" resizeMode="contain" />
      </View>
    );
  }

  return null;
}

export default index;
