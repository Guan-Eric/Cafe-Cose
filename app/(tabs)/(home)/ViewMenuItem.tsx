import { View, Text, Image, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import BackButton from 'components/BackButton';
import RunImageCarousel from 'components/RunImageCarousel';
import BackButtonWithBackground from 'components/BackButtonWithBackground';

const ViewMenuItem = () => {
  const { id, name, description, price, menuImageUrls, category } = useLocalSearchParams();
  const updatedImageUrl = (menuImageUrls as string)?.replaceAll('/o/menu/', '/o/menu%2F');
  const imageUrls = updatedImageUrl.length > 0 ? updatedImageUrl.split(',') : [];

  return (
    <View className="flex-1">
      {imageUrls?.length > 0 ? (
        <>
          <BackButtonWithBackground />
          <RunImageCarousel data={imageUrls} runId={id as string} isDownloadable={true} />
        </>
      ) : null}
      <SafeAreaView className="flex-1 bg-background p-6">
        <View className="mb-2 flex-row items-center">
          {imageUrls.length == 0 ? <BackButton /> : null}
        </View>

        <Text className="px-4 text-3xl font-bold text-text">{name}</Text>
        <Text className="mt-4 px-4 text-2xl font-semibold text-primary">
          ${parseFloat(price as string)?.toFixed(2)}
        </Text>
        <Text className="mt-2 px-4 text-2xl font-semibold text-text">{category}</Text>
        <Text className="mt-2 px-4 text-lg text-text/70">{description}</Text>
      </SafeAreaView>
    </View>
  );
};

export default ViewMenuItem;
