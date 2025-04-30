import { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import { logOut } from '../../../backend/auth';
import LoyaltyCard from '../../../components/cards/LoyaltyCard';
import { getUser, savePushToken } from 'backend/user';
import { FIREBASE_AUTH } from 'firebaseConfig';
import { Announcement } from 'components/types';
import AnnouncementCard from 'components/cards/AnnouncementCard';
import { getAnnouncements } from 'backend/announcement';
import useNotifications from 'backend/notification';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function HomeScreen() {
  const [stamps, setStamps] = useState(0);
  const [announcement, setAnnouncement] = useState<Announcement[]>([]);
  const { expoPushToken } = useNotifications();

  const fetchStamps = async () => {
    try {
      const user = await getUser(FIREBASE_AUTH.currentUser?.uid as string);
      if (user) {
        setStamps(user.points % 10 || 0);
      }
    } catch (error) {
      console.error('Error fetching stamps:', error);
    }
  };

  const fetchAnnouncements = async () => {
    const announcementData = await getAnnouncements();
    setAnnouncement(announcementData);
  };

  useEffect(() => {
    console.log(expoPushToken);
    if (expoPushToken) {
      savePushToken(expoPushToken);
    }
  }, [expoPushToken]);

  useEffect(() => {
    fetchAnnouncements();
    fetchStamps();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStamps();
      fetchAnnouncements();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-2">
          <Text className="text-2xl font-bold text-text">Home</Text>
          <Pressable onPress={() => logOut()}>
            <MaterialCommunityIcons name="account" size={24} color="#ffffff" />
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-4">
          <View className="py-4">
            <Text className="text-xl font-semibold text-text">Welcome to Café Cosé</Text>
            <Text className="mt-2 text-gray-400">Pointe-Saint-Charles</Text>
          </View>

          <View className="items-center">
            <LoyaltyCard
              points={stamps}
              onPress={() => router.push({ pathname: '/(tabs)/(home)/QRCodeScreen' })}
            />
          </View>

          <View className="mt-2">
            <Text className="text-lg font-semibold text-text">Announcements</Text>
            <View className="mt-2 items-center">
              {announcement.map((announcementItem) => (
                <AnnouncementCard
                  key={announcementItem.id}
                  announcement={announcementItem}
                  onPress={() =>
                    router.push({
                      pathname: '/(tabs)/(home)/ViewAnnouncementScreen',
                      params: {
                        id: announcementItem.id,
                        message: announcementItem.message,
                        title: announcementItem.title,
                        createdAt: announcementItem.createdAt.toISOString(),
                        imageUrl: announcementItem.imageUrl,
                        notificationMessage: announcementItem.notificationMessage,
                      },
                    })
                  }
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;
