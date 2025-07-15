import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { createFeedback } from 'backend/feedback';

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
    <View className="flex-1 justify-center bg-background px-4">
      <Text className="mb-4 text-2xl font-bold text-text">User Feedback</Text>
      <TextInput
        multiline
        numberOfLines={4}
        value={feedback}
        onChangeText={setFeedback}
        placeholder="Enter your feedback here..."
        className="mb-4 h-40 rounded-lg border border-gray-300 p-2"
      />
      <TouchableOpacity
        className="w-[180px] self-center rounded-full bg-primary p-3"
        onPress={handleSubmit}>
        <Text className="text-center font-semibold text-white">Submit Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FeedbackScreen;
