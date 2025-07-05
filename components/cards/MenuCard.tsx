import React from 'react';
import { View, Text, Pressable, Image, Animated } from 'react-native';
import { MenuItem } from 'components/types';
import useButtonAnimation from 'components/useButtonAnimation';
import MenuCardImage from 'components/MenuCardImage';

interface MenuCardProps {
  menuItem: MenuItem;
  onPress?: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ menuItem, onPress }) => {
  const { scaleValue, handlePressIn, handlePressOut } = useButtonAnimation(0.95);
  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        className="m-2 rounded-2xl bg-white p-4 shadow-sm"
        style={{ transform: [{ scale: scaleValue }] }}>
        <MenuCardImage url={menuItem.imageUrl} />
        <View className="justify-between">
          <View>
            <Text className="text-lg font-[Lato_400Regular] text-text">{menuItem.name}</Text>
          </View>
          <Text className="text-base font-[Lato_400Regular] text-primary">
            ${menuItem?.price?.toFixed(2)}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default MenuCard;
