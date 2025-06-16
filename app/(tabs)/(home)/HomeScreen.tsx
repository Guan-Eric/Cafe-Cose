import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import LoyaltyCard from '../../../components/cards/LoyaltyCard';
import { getUser, savePushToken } from 'backend/user';
import { FIREBASE_AUTH } from 'firebaseConfig';
import { Announcement, Category, MenuItem, User } from 'components/types';
import AnnouncementCard from 'components/cards/AnnouncementCard';
import { getAnnouncements } from 'backend/announcement';
import useNotifications from 'backend/notification';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CardLoader from 'components/loaders/CardLoader';
import { getMenu } from 'backend/menu';
import MenuCard from 'components/cards/MenuCard';

function HomeScreen() {
  const [user, setUser] = useState<User>();
  const [stamps, setStamps] = useState(0);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const { expoPushToken } = useNotifications();

  const fetchStamps = async () => {
    try {
      const user = await getUser(FIREBASE_AUTH.currentUser?.uid as string);
      if (user) {
        setStamps(user.points % 10 || 0);
        setUser(user);
      }
    } catch (error) {
      console.error('Error fetching stamps:', error);
    }
  };
  const fetchMenuFiltered = async () => {
    const menuData = await getMenu();
    setMenu(menuData);
    setFilteredMenu(menuData);
  };
  const fetchMenu = async () => {
    const menuData = await getMenu();
    setMenu(menuData);
  };

  const filterMenu = (category: Category | 'All') => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredMenu(menu);
    } else {
      const filtered = menu.filter((item) => item.category === category);
      setFilteredMenu(filtered);
    }
  };

  useEffect(() => {
    if (expoPushToken) {
      savePushToken(expoPushToken);
    }
  }, [expoPushToken]);

  useEffect(() => {
    let showLoading = setTimeout(() => setLoading(true), 200);

    const loadData = async () => {
      await fetchMenuFiltered();
      await fetchStamps();
      clearTimeout(showLoading);
      setLoading(false);
    };

    loadData();

    return () => clearTimeout(showLoading);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStamps();
      fetchMenu();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />
      <View className="flex-1">
        <View className="flex-row items-center justify-between py-2 pl-4 pr-6">
          <Text className="pl-2 text-2xl font-bold text-text">Home</Text>
          <View className="flex-row items-center">
            {user?.admin && (
              <Pressable
                className="mr-2 rounded-lg bg-blue-500 px-4 py-2"
                onPress={() =>
                  router.replace({
                    pathname: `/(admin)/(home)/HomeScreen`,
                  })
                }>
                <Text className="text-lg font-semibold text-text">Admin</Text>
              </Pressable>
            )}

            <Pressable
              onPress={() =>
                router.push({
                  pathname: `/(tabs)/(home)/SettingsScreen`,
                  params: {
                    username: user?.name,
                    userUrl: user?.url,
                    userAnnouncement: user?.announcements?.toString(),
                    userRun: user?.runs?.toString(),
                  },
                })
              }>
              <MaterialCommunityIcons name="cog" size={24} color="#1a1a1a" />
            </Pressable>
          </View>
        </View>

        <ScrollView className="flex-1 px-4">
          <View className="py-4">
            <Text className="pl-2 text-xl font-semibold text-text">Welcome to Café Cosé</Text>
            <Text className="mt-2 pl-2 text-gray-400">Pointe-Saint-Charles</Text>
          </View>

          <View className="items-center">
            <LoyaltyCard
              points={stamps}
              onPress={() => router.push({ pathname: '/(tabs)/(home)/QRCodeScreen' })}
            />
          </View>

          <View className="mt-2">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={['All', ...Object.values(Category)]}
              renderItem={({ item }) => (
                <Pressable
                  className={`ml-2 rounded-lg p-2 ${item === selectedCategory ? 'bg-primary' : 'bg-gray-400'}`}
                  onPress={() => filterMenu(item as Category)}>
                  <Text className="text-white">{item}</Text>
                </Pressable>
              )}
              keyExtractor={(item) => item}
            />
            <View className="mt-2 flex-row flex-wrap justify-start justify-between">
              {!loading && filteredMenu.length > 0 ? (
                filteredMenu.map((menuItem) => (
                  <MenuCard
                    key={menuItem.id}
                    menuItem={menuItem}
                    onPress={() =>
                      router.push({
                        pathname: '/(tabs)/(home)/ViewMenuItem',
                        params: {
                          id: menuItem.id,
                          name: menuItem.name,
                          description: menuItem.description,
                          price: menuItem.price,
                          imageUrl: menuItem.imageUrl,
                          available: menuItem.available?.toString(),
                          category: menuItem.category,
                          index: menuItem.index,
                        },
                      })
                    }
                  />
                ))
              ) : (
                <View className="m-2 flex-row flex-wrap justify-between gap-6">
                  <CardLoader width={Dimensions.get('window').width * 0.4} height={180} />
                  <CardLoader width={Dimensions.get('window').width * 0.4} height={180} />
                  <CardLoader width={Dimensions.get('window').width * 0.4} height={180} />
                  <CardLoader width={Dimensions.get('window').width * 0.4} height={180} />
                  <CardLoader width={Dimensions.get('window').width * 0.4} height={180} />
                  <CardLoader width={Dimensions.get('window').width * 0.4} height={180} />
                  <CardLoader width={Dimensions.get('window').width * 0.4} height={180} />
                  <CardLoader width={Dimensions.get('window').width * 0.4} height={180} />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;
