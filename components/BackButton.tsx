import React from 'react';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
  color: string;
}

const BackButton: React.FC<BackButtonProps> = ({ color }) => {
  return (
    <TouchableOpacity onPress={() => router.back()} className="self-start p-2">
      <Ionicons name="chevron-back" size={30} color={color} />
    </TouchableOpacity>
  );
};

export default BackButton;
