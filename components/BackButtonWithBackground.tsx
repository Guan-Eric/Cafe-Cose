import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import BackButton from './BackButton';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BackButtonWithBackground: React.FC = () => {
  return (
    <View className="absolute left-4 top-14 z-10 rounded-xl bg-[#3C3C3C]/50">
      <TouchableOpacity onPress={() => router.back()} className="self-start p-2">
        <Ionicons name="chevron-back" size={30} color="#F8F8F8" />
      </TouchableOpacity>
    </View>
  );
};

export default BackButtonWithBackground;
