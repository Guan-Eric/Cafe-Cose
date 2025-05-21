import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem } from 'components/types';

interface MenuCardProps {
  menuItem: MenuItem;
  onPress?: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ menuItem, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <View className="m-4 rounded-2xl bg-white p-4 shadow-sm">
        <Image
          source={{ uri: menuItem.imageUrl }}
          className="h-[120px] w-[120px] rounded-lg"
          resizeMode="cover"
        />
        <View className="justify-between">
          <View>
            <Text className="text-lg font-[Lato_400Regular] text-text">{menuItem.name}</Text>
            <Text className="text-sm font-[Lato_400Regular] text-text/60" numberOfLines={2}>
              {menuItem.description}
            </Text>
          </View>
          <Text className="text-base font-[Lato_400Regular] text-primary">
            ${menuItem.price.toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default MenuCard;
