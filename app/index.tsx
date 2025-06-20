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
  const [promo, setPromo] = useState<Promotion | null>();
  const [lastSeenPromoId, setLastSeenPromoId] = useState('');

  const checkPromo = async () => {
    const latestPromo = await getLatestPromotion();
    setPromo(latestPromo);
    const storedPromoId = await AsyncStorage.getItem('lastSeenPromoId');
    setLastSeenPromoId(storedPromoId || '');
  };

  const checkFirstLaunch = async () => {
    const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');

    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (true) {
        router.replace('/(auth)/OnboardingScreen');
      } else if (user) {
        if (promo?.id && promo.id !== lastSeenPromoId) {
          router.push({
            pathname: '/PromotionScreen',
            params: {
              id: promo.id,
              title: promo.title,
              message: promo.message,
              imageUrl: promo.imageUrl,
            },
          });
        } else {
          router.replace('/(tabs)/(home)/HomeScreen');
        }
      } else {
        router.replace('/(auth)/WelcomeScreen');
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await checkPromo();
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
