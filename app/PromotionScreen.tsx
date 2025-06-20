import { View, Text, Image, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PromotionScreen() {
  const { id, title, message, imageUrl } = useLocalSearchParams();

  const handleDismiss = async () => {
    await AsyncStorage.setItem('lastSeenPromoId', id as string);
    router.replace('/(tabs)/(home)/HomeScreen');
  };

  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      {imageUrl && (
        <Image source={{ uri: imageUrl as string }} className="mb-4 h-64 w-full rounded-xl" />
      )}
      <Text className="text-2xl font-bold text-text">{title}</Text>
      <Text className="mt-2 text-center text-base text-text">{message}</Text>

      <Pressable onPress={handleDismiss} className="mt-8 rounded-xl bg-primary px-6 py-3">
        <Text className="text-lg font-semibold text-white">Continue</Text>
      </Pressable>
    </View>
  );
}
