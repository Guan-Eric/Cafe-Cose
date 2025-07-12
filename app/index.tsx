import { Image, View } from 'react-native';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLatestPromotion } from 'backend/promotion';
import { Promotion } from 'components/types';

function Index() {
  const [loading, setLoading] = useState(true);

  const checkFirstLaunch = async () => {
    const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');

    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (!hasOnboarded) {
        router.replace('/OnboardingScreen');
      } else if (user) {
        router.replace('/PromotionScreen');
      } else {
        router.replace('/(auth)/WelcomeScreen');
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await checkFirstLaunch();
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Image source={require('../assets/logo.png')} className="w-200 h-32" resizeMode="contain" />
      </View>
    );
  }

  return null;
}

export default Index;
