import { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import MenuCard from '../../../components/cards/MenuCard';
import { getUser } from 'backend/user';
import { FIREBASE_AUTH } from 'firebaseConfig';
import { getMenu } from 'backend/menu';
import { MenuItem } from 'components/types';

function MenuScreen() {
  const [stamps, setStamps] = useState(0);
  const [menu, setMenu] = useState<MenuItem[]>([]);

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

  const fetchMenu = async () => {
    const menuData = await getMenu();
    setMenu(menuData);
  };

  useEffect(() => {
    fetchMenu();
    fetchStamps();
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
        <View className="flex-row items-center justify-between px-4 py-2">
          <Text className="text-2xl font-bold text-text">Menu</Text>
        </View>

        <ScrollView className="flex-1 px-4">
          <View className="mt-2">
            <View className="mt-2 items-center">
              {menu.map((menuItem) => (
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
                        available: menuItem.available.toString(),
                        category: menuItem.category,
                        index: menuItem.index,
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

export default MenuScreen;
