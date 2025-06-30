import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';

interface PromotionComponentProps {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  buttonTitle: string;
  handleDismiss: () => void;
}

export default function PromotionComponent({
  id,
  title,
  message,
  imageUrl,
  buttonTitle,
  handleDismiss,
}: PromotionComponentProps) {
  const handleCreatePromotion = () => {
    router.push('/(admin)/(promotion)/CreatePromotionScreen');
  };

  const { width, height } = Dimensions.get('window');

  return (
    <View className="relative flex-1 justify-around bg-background">
      {imageUrl && (
        <Image source={{ uri: imageUrl }} resizeMode="cover" style={{ width, height: width }} />
      )}
      <View className="absolute bottom-0 w-full px-6 pb-12">
        <Text className="mb-1 text-3xl font-bold text-primary">{title}</Text>
        <Text className="text-bold mt-2 text-text">{message}</Text>
        <View className="mt-6 flex-row gap-4">
          <Pressable onPress={handleDismiss} className="rounded-full bg-primary px-6 py-3 shadow">
            <Text className="text-lg font-semibold text-white">{buttonTitle}</Text>
          </Pressable>
          {buttonTitle === 'Edit' && (
            <Pressable
              onPress={handleCreatePromotion}
              className="bg-muted rounded-full border border-primary px-6 py-3">
              <Text className="text-lg font-semibold text-primary">Create Promotion</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
