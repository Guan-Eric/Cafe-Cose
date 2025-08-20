import { View, Text, Image, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
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
    router.push('/(admin)/(home)/CreatePromotionScreen');
  };

  return (
    <View className="flex-1 justify-between bg-background">
      {imageUrl && (
        <ImageBackground source={{ uri: imageUrl }} resizeMode="cover" className="h-[80%] w-full" />
      )}
      <View className="w-full px-6 pb-12">
        <Text className="mb-1 mt-2 font-sans text-text">{title}</Text>
        <Text className="font-sans text-3xl text-primary">{message}</Text>
        <View className="mb-4 mt-6 flex-row gap-4 self-end">
          {buttonTitle === 'Edit' && (
            <TouchableOpacity
              onPress={handleCreatePromotion}
              className="bg-muted rounded-full border border-primary px-6 py-3">
              <Text className="font-sans text-lg text-primary">Create Promotion</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleDismiss}
            className=" rounded-full bg-primary px-6 py-3 shadow">
            <Text className="font-sans text-lg text-white">{buttonTitle}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
