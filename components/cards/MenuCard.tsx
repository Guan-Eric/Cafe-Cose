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
        className="m-2 rounded-3xl bg-card shadow-sm"
        style={{ transform: [{ scale: scaleValue }] }}>
        <MenuCardImage url={menuItem.imageUrl} />
        <View className="justify-between px-4 py-1 pb-2">
          <View>
            <Text className="font-sans text-lg text-text">{menuItem.name}</Text>
          </View>
          <Text className="font-sans text-base text-primary">${menuItem?.price?.toFixed(2)}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default MenuCard;
