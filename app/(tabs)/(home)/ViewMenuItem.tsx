import { View, Text, Image, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import BackButton from 'components/BackButton';
import RunImageCarousel from 'components/RunImageCarousel';
import BackButtonWithBackground from 'components/BackButtonWithBackground';

const ViewMenuItem = () => {
  const { id, name, description, price, imageUrl, category } = useLocalSearchParams();
  const fixedImageUrl = (imageUrl as string)?.replace('/o/menu/', '/o/menu%2F');

  return (
    <SafeAreaView className="flex-1 bg-background p-6">
      <View className="mb-2 flex-row items-center">
        {true ? <BackButton /> : null}
        <Text className=" text-3xl font-bold text-text">{name}</Text>
      </View>
      <View className="flex-1 px-6">
        {imageUrl?.length > 0 ? (
          <>
            <BackButtonWithBackground />
            <RunImageCarousel
              data={[imageUrl as string]}
              runId={id as string}
              isDownloadable={true}
            />
          </>
        ) : null}
        <Text className="mt-4 text-2xl font-semibold text-primary">
          ${parseFloat(price as string)?.toFixed(2)}
        </Text>
        <Text className="mt-2 text-2xl font-semibold text-text">{category}</Text>
        <Text className="mt-2 text-lg text-text/70">{description}</Text>
      </View>
    </SafeAreaView>
  );
};

export default ViewMenuItem;
