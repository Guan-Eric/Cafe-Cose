import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import MenuCard from '../../../components/cards/MenuCard';
import { getMenu } from 'backend/menu';
import { router, useFocusEffect } from 'expo-router';
import BackButton from 'components/BackButton';
import { MenuItem } from 'components/types';

function MenuScreen() {
  const [menu, setMenu] = useState<MenuItem[]>([]);

  const fetchMenu = async () => {
    setMenu(await getMenu());
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMenu();
    }, [])
  );

  const handleAddMenuItem = () => {
    router.push({ pathname: '/(admin)/(menu)/AddMenuItemForm' });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-2">
          <Text className="text-2xl font-bold text-text">Edit Menu</Text>
          <Pressable onPress={handleAddMenuItem} className="rounded-lg bg-blue-500 px-4 py-2">
            <Text className="text-lg font-[Lato_400Regular] text-text">+ Add Menu Item</Text>
          </Pressable>
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
                      pathname: '/(admin)/(menu)/EditMenuItemForm',
                      params: {
                        id: menuItem.id,
                        menuName: menuItem.name,
                        menuDescription: menuItem.description,
                        menuPrice: menuItem.price,
                        menuImageUrl: menuItem.imageUrl,
                        menuAvailable: menuItem.available.toString(),
                        menuCategory: menuItem.category,
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
