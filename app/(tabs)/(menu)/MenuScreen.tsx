import { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import MenuCard from '../../../components/cards/MenuCard';
import { getUser } from 'backend/user';
import { FIREBASE_AUTH } from 'firebaseConfig';
import { getMenu } from 'backend/menu';
import { MenuItem } from 'components/types';
import CardLoader from 'components/loaders/CardLoader';

function MenuScreen() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMenu = async () => {
    const menuData = await getMenu();
    setMenu(menuData);
  };

  useEffect(() => {
    setLoading(true);
    fetchMenu();
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMenu();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-2">
          <Text className="text-2xl font-bold text-text">Menu</Text>
        </View>

        <ScrollView className="flex-1 px-4">
          <View className="mt-2">
            <View className="mt-2 flex-row flex-wrap justify-start justify-between">
              {!loading && menu.length > 0 ? (
                menu.map((menuItem) => (
                  <MenuCard
                    key={menuItem.id}
                    menuItem={menuItem}
                    onPress={() =>
                      router.push({
                        pathname: '/(tabs)/(menu)/ViewMenuItem',
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
                <View className="mx-2 flex-row flex-wrap justify-between gap-6">
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

export default MenuScreen;
