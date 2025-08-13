import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { createFeedback } from 'backend/feedback';
import BackButton from 'components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    console.log(feedback);
    if (feedback.trim()) {
      await createFeedback(feedback);
      Alert.alert('Feedback Submitted', 'Thank you for your feedback!');
      setFeedback('');
      router.back();
    } else {
      Alert.alert('Error', 'Please enter your feedback before submitting.');
    }
  };

  return (
    <SafeAreaView className="flex-1  bg-background ">
      <View className="mb-4 flex-row items-center">
        <BackButton />
        <Text className="font-sans text-3xl text-text">User Feedback</Text>
      </View>
      <TextInput
        multiline
        numberOfLines={10}
        value={feedback}
        onChangeText={setFeedback}
        placeholder="Enter your feedback here..."
        className="mx-4 mb-4 h-60 rounded-xl border-2 border-primary p-3"
      />
      <TouchableOpacity
        className="w-[180px] self-center rounded-full bg-primary p-3"
        onPress={handleSubmit}>
        <Text className="text-center font-semibold text-white">Submit Feedback</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FeedbackScreen;
