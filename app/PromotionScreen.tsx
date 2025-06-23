import { View, Text, Image, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PromotionComponent from 'components/PromotionComponent';

export default function PromotionScreen() {
  const { id, title, message, imageUrl } = useLocalSearchParams();

  const handleDismiss = async () => {
    await AsyncStorage.setItem('lastSeenPromoId', id as string);
    router.replace('/(tabs)/(home)/HomeScreen');
  };

  return (
    <PromotionComponent
      id={id as string}
      title={title as string}
      message={message as string}
      buttonTitle="Continue"
      handleDismiss={handleDismiss}
    />
  );
}
