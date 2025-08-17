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
  const participants = (run.participants || []).filter((p) => p.status === 'yes');
  const maxAvatars = 3;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="mb-4 w-[90%] self-center">
      <Animated.View
        style={{ transform: [{ scale: scaleValue }] }}
        className="w-full self-center rounded-2xl bg-card p-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="justify-between">
            <Text className="mb-1 font-sans text-lg text-text">{formattedDate}</Text>
            <Text className="text-base text-text">{run.message}</Text>
          </View>
          <View className="flex-row items-center justify-center gap-2 py-2 pl-4">
            {participants.length > 0 && (
              <View className="flex-row items-center">
                {participants.length > 0 && (
                  <View className=" flex-row items-center">
                    {participants.slice(0, maxAvatars).map((p, index) => (
                      <View
                        key={index}
                        style={{
                          marginLeft: index === 0 ? 0 : -16,
                          zIndex: maxAvatars - index,
                        }}
                        className="h-9 w-9 overflow-hidden rounded-full border-2 border-card bg-primary">
                        {p.url ? (
                          <Image
                            source={{ uri: p.url }}
                            className="h-full w-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="flex-1 items-center justify-center">
                            <Text className="font-sans text-xs text-white">
                              {p.name?.charAt(0).toUpperCase() || '?'}
                            </Text>
                          </View>
                        )}
                      </View>
                    ))}

                    {participants.length > maxAvatars && (
                      <View
                        style={{ marginLeft: -4 }}
                        className="z-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white ">
                        <Text className="font-sans text-xs text-text">
                          +{participants.length - maxAvatars}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
            <Ionicons name="chevron-forward" size={16} color="#762e1f" />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default RunCard;
