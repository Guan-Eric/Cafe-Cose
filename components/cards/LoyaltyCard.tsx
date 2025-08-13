import useButtonAnimation from 'components/useButtonAnimation';
import React from 'react';
import { View, Text, Pressable, Image, Animated } from 'react-native';

interface LoyaltyCardProps {
  points: number;
  onPress?: () => void;
}

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ points, onPress }) => {
  const stamps = Math.min(Math.floor(points % 10), 9);
  const rows = 2;
  const stampsPerRow = 5;
  const { scaleValue, handlePressIn, handlePressOut } = useButtonAnimation(0.95);

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        className="m-2 rounded-3xl bg-card p-4 shadow-md"
        style={{ transform: [{ scale: scaleValue }] }}>
        <View className=" justify-center">
          {[...Array(rows)].map((_, rowIndex) => (
            <View key={rowIndex} className="space-around flex-row justify-center">
              {[...Array(stampsPerRow)].map((_, colIndex) => {
                const stampIndex = rowIndex * stampsPerRow + colIndex;
                return (
                  <Image
                    key={stampIndex}
                    source={require('../../assets/logo.png')}
                    className="m-1 h-16 w-16"
                    resizeMode="contain"
                    style={{
                      opacity: stampIndex < stamps ? 1 : 0.25,
                    }}
                  />
                );
              })}
            </View>
          ))}
        </View>
        <Text className="pl-2 text-sm font-[Lato_400Regular] text-text/80">
          Tap to scan QR code
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default LoyaltyCard;
