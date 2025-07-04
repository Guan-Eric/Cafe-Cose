import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Run } from 'components/types';

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

  return (
    <Pressable onPress={onPress} className="w-[95%] self-center rounded-2xl bg-white p-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="justify-between">
          <Text className="mb-1 text-lg font-bold text-text">{formattedDate}</Text>
          <Text className="text-base text-text">{run.message}</Text>
        </View>
        <Pressable onPress={onPress} className="rounded-full px-4 py-2">
          <Text className="font-semibold text-primary underline">
            {run.date > new Date() ? 'Join Run' : 'View Run'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default RunCard;
