import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { getFeedbacks } from 'backend/feedback';
import { Feedback } from 'components/types';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import BackButton from 'components/BackButton';

export default function ViewFeedbackScreen() {
  const { id, feedback, name, createdAt } = useLocalSearchParams();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center">
        <BackButton />
        <Text className="text-3xl font-bold text-text">Feedback</Text>
      </View>
      <ScrollView>
        <View className="p-4">
          <Text className="text-lg font-semibold text-text">{name}</Text>
          <Text className="text-base text-text">{feedback}</Text>
          <Text className="text-sm text-gray-500">{createdAt}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
