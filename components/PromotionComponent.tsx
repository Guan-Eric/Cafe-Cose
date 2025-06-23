import { View, Text, Image, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PromotionComponentProps {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  buttonTitle: string;
  handleDismiss: () => {};
}

export default function PromotionComponent({
  id,
  title,
  message,
  imageUrl,
  buttonTitle,
  handleDismiss,
}: PromotionComponentProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      {imageUrl && (
        <Image source={{ uri: imageUrl as string }} className="mb-4 h-64 w-full rounded-xl" />
      )}
      <Text className="text-2xl font-bold text-text">{title}</Text>
      <Text className="mt-2 text-center text-base text-text">{message}</Text>

      <Pressable onPress={handleDismiss} className="mt-8 rounded-xl bg-primary px-6 py-3">
        <Text className="text-lg font-semibold text-white">{buttonTitle}</Text>
      </Pressable>
    </View>
  );
}
