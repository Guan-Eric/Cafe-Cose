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
      <View className="m-2 rounded-2xl bg-white p-4 shadow-sm">
        <Image
          source={{ uri: menuItem.imageUrl }}
          className={`h-[130px] w-[130px] rounded-lg`}
          resizeMode="cover"
        />
        <View className="justify-between">
          <View>
            <Text className="text-lg font-[Lato_400Regular] text-text">{menuItem.name}</Text>
          </View>
          <Text className="text-base font-[Lato_400Regular] text-primary">
            ${menuItem?.price?.toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default MenuCard;
