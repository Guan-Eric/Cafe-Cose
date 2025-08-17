import { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { getAnnouncements } from 'backend/announcement';
import { router, useFocusEffect } from 'expo-router';
import { Announcement } from 'components/types';
import AnnouncementCard from 'components/cards/AnnouncementCard';

function AnnouncementScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const fetchAnnouncements = async () => {
    const data = await getAnnouncements();
    setAnnouncements(data);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAnnouncements();
    }, [])
  );

  const handleAddAnnouncement = () => {
    router.push('/(admin)/(announcement)/CreateAnnouncementScreen');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-2">
          <Text className="text-2xl font-bold text-text">Announcements</Text>
          <TouchableOpacity
            onPress={handleAddAnnouncement}
            className="rounded-full bg-primary px-4 py-2">
            <Text className="text-secondaryText text-lg font-[Lato_400Regular]">
              + Add Announcement
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-1 px-4">
          <View className="mt-2 items-center">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onPress={() =>
                    router.push({
                      pathname: '/(admin)/(announcement)/EditAnnouncementScreen',
                      params: {
                        id: announcement.id,
                        title: announcement.title,
                        message: announcement.message,
                        notificationMessage: announcement.notificationMessage,
                        createdAt: announcement.createdAt?.toString(),
                        announcementImageUrls: announcement.imageUrls,
                      },
                    })
                  }
                />
              ))
            ) : (
              <Text className="text-text">No announcements available.</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default AnnouncementScreen;
