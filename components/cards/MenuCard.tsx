import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MenuItem } from 'components/types';
import useButtonAnimation from 'components/useButtonAnimation';
import MenuCardImage from 'components/MenuCardImage';
import Animated from 'react-native-reanimated';

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
        style={{ transform: [{ scale: scaleValue.value }] }}>
        <MenuCardImage url={menuItem.imageUrls?.[0] || ''} />
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
