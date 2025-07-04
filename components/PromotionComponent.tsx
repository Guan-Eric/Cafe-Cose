import { View, Text, Image, Pressable, Dimensions, ImageBackground } from 'react-native';
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
    <View className="flex-1 justify-between bg-background">
      {imageUrl && (
        <ImageBackground
          source={{ uri: imageUrl }}
          resizeMode="cover"
          className="h-[85%] w-full "
        />
      )}
      <View className="w-full px-6 pb-12">
        <Text className="text-bold mb-1 mt-2 text-text">{title}</Text>
        <Text className="text-3xl font-bold text-primary">{message}</Text>
        <View className="mt-6 flex-row gap-4 self-end">
          {buttonTitle === 'Edit' && (
            <Pressable
              onPress={handleCreatePromotion}
              className="bg-muted rounded-full border border-primary px-6 py-3">
              <Text className="text-lg font-semibold text-primary">Create Promotion</Text>
            </Pressable>
          )}
          <Pressable onPress={handleDismiss} className="rounded-full bg-primary px-6 py-3 shadow">
            <Text className="text-lg font-semibold text-white">{buttonTitle}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
