import { View, Text, Image, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import BackButton from 'components/BackButton';
import ImageHeaderCarousel from 'components/ImageHeaderCarousel';
import BackButtonWithBackground from 'components/BackButtonWithBackground';

const ViewAnnouncementScreen = () => {
  const { id, message, title, createdAt, announcementImageUrls } = useLocalSearchParams();
  const updatedImageUrl = (announcementImageUrls as string)?.replaceAll(
    '/o/announcements/',
    '/o/announcements%2F'
  );
  const imageUrls = updatedImageUrl.length > 0 ? updatedImageUrl.split(',') : [];

  return (
    <View className="flex-1">
      {imageUrls.length > 0 ? (
        <>
          <BackButtonWithBackground />
          <ImageHeaderCarousel data={imageUrls} runId={id as string} isDownloadable={false} />
        </>
      ) : null}
      <SafeAreaView className="flex-1 bg-background p-6">
        <View className="mb-2 flex-row items-center">
          {imageUrls.length == 0 ? <BackButton color="#3C2A20" /> : null}
        </View>
        <ScrollView>
          <Text className="px-4 font-sans text-3xl text-text">{title}</Text>
          <Text className="mt-2 px-4 text-sm text-text/70">
            {new Date(createdAt as string).toDateString()}
          </Text>
          <Text className="mt-4 px-4 text-lg text-text">{message}</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ViewAnnouncementScreen;
