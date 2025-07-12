import { View, Text, Image, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PromotionComponent from 'components/PromotionComponent';
import { useEffect, useState } from 'react';
import { Promotion } from 'components/types';
import { getLatestPromotion } from 'backend/promotion';

export default function PromotionScreen() {
  const { id } = useLocalSearchParams();
  const [promo, setPromo] = useState<Promotion | null>();

  const handleDismiss = async () => {
    router.push('/(tabs)/(home)/HomeScreen');
  };

  const checkPromo = async () => {
    const latestPromo = await getLatestPromotion();
    setPromo(latestPromo);
  };

  useEffect(() => {
    checkPromo();
  }, []);

  return (
    <PromotionComponent
      id={promo?.id as string}
      title={promo?.title as string}
      message={promo?.message as string}
      imageUrl={promo?.imageUrl as string}
      buttonTitle="Continue"
      handleDismiss={handleDismiss}
    />
  );
}
