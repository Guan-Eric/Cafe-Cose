import React from 'react';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BackButton: React.FC = () => {
  return (
    <TouchableOpacity onPress={() => router.back()} className="self-start p-2">
      <Ionicons name="chevron-back" size={30} color="#3C2A20" />
    </TouchableOpacity>
  );
};

export default BackButton;
