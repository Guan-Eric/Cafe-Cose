import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';

interface LoyaltyCardProps {
  points: number;
  onPress?: () => void;
}

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ points, onPress }) => {
  const stamps = Math.min(Math.floor(points % 10), 9);
  const rows = 2;
  const stampsPerRow = 5;

  return (
    <Pressable onPress={onPress}>
      <View className="m-2 w-[95%] rounded-2xl bg-white p-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-[Lato_400Regular] text-text">Loyalty Stamps</Text>
        </View>
        <Text className="mt-1 text-sm font-[Lato_400Regular] text-text/80">
          Collect 9 stamps and get your 10th drink for free!
        </Text>
        <View className="mt-4 justify-center">
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
        <Text className="mt-2 text-sm font-[Lato_400Regular] text-text/80">
          Tap to scan QR code
        </Text>
      </View>
    </Pressable>
  );
};

export default LoyaltyCard;
