import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import LoyaltyCard from '../../../components/cards/LoyaltyCard';
import { getUser, hasAcceptedLatestTerms, savePushToken, updateTermsCondition } from 'backend/user';
import { FIREBASE_AUTH } from 'firebaseConfig';
import { Category, MenuItem, User } from 'components/types';
import useNotifications from 'backend/notification';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CardLoader from 'components/loaders/CardLoader';
import { getMenu } from 'backend/menu';
import MenuCard from 'components/cards/MenuCard';
import TermsConditionModal from 'components/modals/TermsConditionModal';

function HomeScreen() {
  const [user, setUser] = useState<User>();
  const [stamps, setStamps] = useState(0);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [termsCondition, setTermsCondition] = useState<boolean>(false);
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
      await getTermsCondition();
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

  const getTermsCondition = async () => {
    setTermsCondition(!(await hasAcceptedLatestTerms()));
  };

  const handleTermsCondition = () => {
    updateTermsCondition();
    setTermsCondition(false);
  };

  return (
    <View className="flex-1 bg-background">
      <View
        className={`absolute left-0 right-0 top-0 ${user?.admin ? 'h-[265px]' : 'h-[235px]'} bg-primary`}
      />
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          {user?.admin && (
            <TouchableOpacity
              className="mr-2 w-[130px] items-center self-center rounded-full bg-background px-2 py-1"
              onPress={() =>
                router.replace({
                  pathname: `/(admin)/(home)/HomeScreen`,
                })
              }>
              <Text className="font-sans text-lg text-text">Admin</Text>
            </TouchableOpacity>
          )}
          <View className="flex-row items-center justify-between px-4 pr-2 pt-4">
            <Text className="pl-2 font-sans text-3xl text-offwhite">Welcome to Café Cosé</Text>
            <View className="flex-row items-center px-4">
              <TouchableOpacity
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
                <MaterialCommunityIcons name="cog" size={24} color="#f8f8f8" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="px-4 ">
            <Text className="mt-2 pl-2 font-sans text-xl text-offwhite opacity-60">
              Pointe-Saint-Charles
            </Text>
          </View>
          <View className=" justify-center px-4 pt-4">
            <LoyaltyCard
              points={stamps}
              onPress={() => router.push({ pathname: '/(tabs)/(home)/QRCodeScreen' })}
            />
          </View>
          <ScrollView className="flex-1 ">
            <View className="mt-4 px-4">
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={['All', ...Object.values(Category)]}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`ml-2 rounded-lg px-2  ${
                      item === selectedCategory ? 'bg-primary' : 'bg-background'
                    } ${item === selectedCategory ? '' : 'border border-primary'}`}
                    onPress={() => filterMenu(item as Category)}>
                    <Text
                      className={`${item === selectedCategory ? 'text-white' : 'text-primary'} font-sans text-lg`}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />
            </View>
            <View className="px-4">
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
                            menuImageUrls: menuItem.imageUrls,
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
                    <CardLoader width={Dimensions.get('window').width * 0.42} height={200} />
                    <CardLoader width={Dimensions.get('window').width * 0.42} height={200} />
                    <CardLoader width={Dimensions.get('window').width * 0.42} height={200} />
                    <CardLoader width={Dimensions.get('window').width * 0.42} height={200} />
                    <CardLoader width={Dimensions.get('window').width * 0.42} height={200} />
                    <CardLoader width={Dimensions.get('window').width * 0.42} height={200} />
                    <CardLoader width={Dimensions.get('window').width * 0.42} height={200} />
                    <CardLoader width={Dimensions.get('window').width * 0.42} height={200} />
                  </View>
                )}
              </View>
            </View>
            <Image
              source={require('../../../assets/cafe-cose.png')}
              className="m-1 h-24 w-24 self-center"
              resizeMode="contain"
            />
            <TouchableOpacity
              className="my-4 w-[150px] self-center rounded-full bg-primary py-3"
              onPress={() => router.push('/(tabs)/(home)/FeedbackScreen')}>
              <Text className="text-md text-center font-sans text-offwhite">Give Feedback</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <TermsConditionModal modalVisible={termsCondition} onClose={handleTermsCondition} />
      </SafeAreaView>
    </View>
  );
}

export default HomeScreen;
