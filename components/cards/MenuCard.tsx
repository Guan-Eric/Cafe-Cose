import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuCardProps {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  onPress?: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ title, description, price, imageUrl, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <View className="m-2  w-[95%] flex-row rounded-2xl bg-white p-4 shadow-sm">
        <Image
          source={{ uri: imageUrl }}
          className="h-[80px] w-[80px] rounded-lg"
          resizeMode="cover"
        />
        <View className="ml-4 flex-1 justify-between">
          <View>
            <Text className="text-lg font-[Lato_400Regular] text-text">{title}</Text>
            <Text className="text-sm font-[Lato_400Regular] text-text/60" numberOfLines={2}>
              {description}
            </Text>
          </View>
          <Text className="text-base font-[Lato_400Regular] text-primary">${price.toFixed(2)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#762e1f" className="self-center" />
      </View>
    </Pressable>
  );
};

export default MenuCard;
