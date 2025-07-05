import React from 'react';
import { View, Text, Pressable, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Run } from 'components/types';
import useButtonAnimation from 'components/useButtonAnimation';

interface RunCardProps {
  run: Run;
  onPress?: () => void;
}

const RunCard: React.FC<RunCardProps> = ({ run, onPress }) => {
  const date = new Date(run.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  const { scaleValue, handlePressIn, handlePressOut } = useButtonAnimation(0.95);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="mb-4 w-[95%] self-center">
      <Animated.View
        style={{ transform: [{ scale: scaleValue }] }}
        className="w-full self-center rounded-2xl bg-white p-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="justify-between">
            <Text className="mb-1 text-lg font-bold text-text">{formattedDate}</Text>
            <Text className="text-base text-text">{run.message}</Text>
          </View>
          <View className="flex-row items-center gap-2 py-2 pl-4">
            <Text className="flex-row items-center font-bold text-primary">
              {run.date > new Date() ? 'Join Run' : 'View Run'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#762e1f" />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default RunCard;
