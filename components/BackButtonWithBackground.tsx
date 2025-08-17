import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import BackButton from './BackButton';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BackButtonWithBackground: React.FC = () => {
  return (
    <View className="absolute left-4 top-14 z-10 rounded-full bg-background">
      <TouchableOpacity onPress={() => router.back()} className="self-center p-2">
        <Ionicons name="chevron-back" size={24} color="#3C2A20" />
      </TouchableOpacity>
    </View>
  );
};

export default BackButtonWithBackground;
