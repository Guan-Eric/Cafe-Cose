import { View, Text, Image, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import BackButton from 'components/BackButton';
import RunImageCarousel from 'components/RunImageCarousel';
import BackButtonWithBackground from 'components/BackButtonWithBackground';

const ViewAnnouncementScreen = () => {
  const { id, message, title, createdAt, imageUrl } = useLocalSearchParams();
  const updatedImageUrl = (imageUrl as string)?.replace('/o/announcements/', '/o/announcements%2F');

  return (
    <SafeAreaView className="flex-1 bg-background p-6">
      <View className="mb-2 flex-row items-center">
        {imageUrl.length == 0 ? <BackButton /> : null}
        <Text className="text-3xl font-bold text-text">{title}</Text>
      </View>
      <ScrollView>
        <View className="flex-1 px-6">
          {imageUrl ? (
            <>
              <BackButtonWithBackground />
              <RunImageCarousel
                data={[imageUrl as string]}
                runId={id as string}
                isDownloadable={true}
              />
            </>
          ) : null}
          <Text className="mt-2 text-sm text-text/70">
            {new Date(createdAt as string).toDateString()}
          </Text>
          <Text className="mt-4 text-lg text-text">{message}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewAnnouncementScreen;
