import { View, Text, Image, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import BackButton from 'components/BackButton';

const ViewMenuItem = () => {
  const { id, name, description, price, imageUrl, category } = useLocalSearchParams();
  const fixedImageUrl = (imageUrl as string)?.replace('/o/posts/', '/o/posts%2F');

  return (
    <SafeAreaView className="flex-1 bg-background p-6">
      <View className="mb-2 flex-row items-center">
        <BackButton />
        <Text className=" text-3xl font-bold text-text">{name}</Text>
      </View>
      <View className="flex-1 px-6">
        {imageUrl?.length > 0 ? (
          <Image
            source={{ uri: fixedImageUrl as string }}
            className="h-[350px] w-[350px] self-center rounded-lg shadow-lg"
            resizeMode="cover"
          />
        ) : null}
        <Text className="mt-4 text-2xl font-semibold text-primary">
          ${parseFloat(price as string).toFixed(2)}
        </Text>
        <Text className="mt-2 text-2xl font-semibold text-text">{category}</Text>
        <Text className="mt-2 text-lg text-text/70">{description}</Text>
      </View>
    </SafeAreaView>
  );
};

export default ViewMenuItem;
