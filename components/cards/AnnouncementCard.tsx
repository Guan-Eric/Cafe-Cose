import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Announcement } from 'components/types';
import { format } from 'date-fns';
import useButtonAnimation from 'components/useButtonAnimation';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

interface AnnouncementCardProps {
  announcement: Announcement;
  onPress?: () => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, onPress }) => {
  const { scaleValue, handlePressIn, handlePressOut } = useButtonAnimation(0.95);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });
  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        className="m-2 w-[95%] flex-row rounded-2xl bg-card p-4 shadow-sm"
        style={animatedStyle}>
        <View className="flex-1">
          {announcement.imageUrls ? (
            <Image
              source={{ uri: announcement.imageUrls[0] }}
              className="h-[200px] w-[100%] rounded-lg"
              resizeMode="cover"
            />
          ) : null}
          <Text className="font-sans text-lg text-text">{announcement.title}</Text>
          <Text className="font-sans text-sm text-text/60" numberOfLines={1}>
            {announcement.message}
          </Text>
          <Text className="mt-2 font-sans text-xs text-text/50">
            {announcement.createdAt?.toDateString()}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default AnnouncementCard;
