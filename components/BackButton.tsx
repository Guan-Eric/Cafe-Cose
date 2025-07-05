import React from 'react';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BackButton: React.FC = () => {
  return (
    <TouchableOpacity onPress={() => router.back()} className="self-start p-2">
      <Ionicons name="chevron-back" size={30} color="#1a1a1a" />
    </TouchableOpacity>
  );
};

export default BackButton;
