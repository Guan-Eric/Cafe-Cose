import { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import MenuCard from '../../../components/cards/MenuCard';
import { getUser } from 'backend/user';
import { FIREBASE_AUTH } from 'firebaseConfig';
import { getMenu } from 'backend/menu';
import { Announcement, MenuItem } from 'components/types';
import CardLoader from 'components/loaders/CardLoader';
import { getAnnouncements } from 'backend/announcement';
import AnnouncementCard from 'components/cards/AnnouncementCard';

function MenuScreen() {
  const [announcement, setAnnouncement] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAnnouncements = async () => {
    const menuData = await getAnnouncements();
    setAnnouncement(menuData);
  };

  useEffect(() => {
    let showLoading = setTimeout(() => setLoading(true), 200);

    const loadData = async () => {
      await fetchAnnouncements();
      clearTimeout(showLoading);
      setLoading(false);
    };

    loadData();

    return () => clearTimeout(showLoading);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAnnouncements();
    }, [])
  );

  return (
    <View className="flex-1 bg-background">
      <View className="absolute left-0 right-0 top-0 h-[235px] bg-primary" />
      <SafeAreaView className="flex-1">
        <StatusBar style="light" />
        <View className="flex-1">
          <View className="flex-row items-center justify-between px-4 pt-2">
            <Text className="pl-4 font-sans text-3xl text-offwhite">Announcements</Text>
          </View>
          <ScrollView className="flex-1 px-4">
            <View className="mt-2">
              <View className="mt-2 items-center">
                {loading ? (
                  <View className="gap-4">
                    <CardLoader width={Dimensions.get('window').width * 0.9} height={200} />
                    <CardLoader width={Dimensions.get('window').width * 0.9} height={200} />
                  </View>
                ) : (
                  announcement.map((announcementItem) => (
                    <AnnouncementCard
                      key={announcementItem.id}
                      announcement={announcementItem}
                      onPress={() =>
                        router.push({
                          pathname: '/(tabs)/(announcement)/ViewAnnouncementScreen',
                          params: {
                            id: announcementItem.id,
                            message: announcementItem.message,
                            title: announcementItem.title,
                            createdAt: announcementItem.createdAt?.toISOString(),
                            announcementImageUrls: announcementItem.imageUrls,
                            notificationMessage: announcementItem.notificationMessage,
                          },
                        })
                      }
                    />
                  ))
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default MenuScreen;
