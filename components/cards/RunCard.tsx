import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Run } from 'components/types';

interface RunCardProps {
  run: Run;
  onPress?: () => void;
}

const RunCard: React.FC<RunCardProps> = ({ run, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <View className="m-2 w-[95%] flex-row rounded-2xl bg-white p-4 shadow-sm">
        <View className="flex-1">
          {run.imageUrl ? (
            <Image
              source={{ uri: run.imageUrl }}
              className="h-[200px] w-[100%] rounded-lg"
              resizeMode="cover"
            />
          ) : null}
          <Text className="text-lg font-[Lato_400Regular] text-text">{run.title}</Text>
          <Text
            className="text-sm font-[Lato_400Regular] text-text/60"
            numberOfLines={1}
            ellipsizeMode="tail">
            {run.message}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default RunCard;
