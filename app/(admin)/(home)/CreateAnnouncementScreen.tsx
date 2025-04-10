import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import { Announcement } from 'components/types';
import * as ImagePicker from 'expo-image-picker';

const CreateAnnouncementScreen = () => {
  const [title, setTitle] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [blob, setBlob] = useState<Blob>();

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      aspect: [1, 1],
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      try {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();

        console.log('Upload successful:', response, blob);
        setImageUrl(result.assets[0].uri);
        setBlob(blob);
      } catch (error) {
        console.error('Error uploading images:', error);
      }
    } else {
      console.log('Image selection was canceled.');
    }
  };

  const handleCreateAnnouncement = () => {
    if (!title || !message) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title,
      message,
      createdAt: new Date(),
    };

    // Here you would typically send the newAnnouncement to your backend or state management
    console.log('Announcement created:', newAnnouncement);

    // Navigate back to the home screen after creating the announcement
    router.push('/(admin)/(home)/HomeScreen');
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <View className="flex-1">
        <Text className="text-2xl font-bold text-text">Create Announcement</Text>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          className="my-4 border-b border-gray-300 p-2"
        />
        <TextInput
          placeholder="Message"
          value={message}
          onChangeText={setMessage}
          multiline
          className="my-4 border-b border-gray-300 p-2"
        />
        {imageUrl ? (
          <Pressable
            onPress={handleImageUpload}
            className="mt-4 h-[254px] w-[254px] items-center justify-center self-center">
            <Image
              source={{ uri: imageUrl }}
              className="h-full w-full rounded-lg"
              resizeMode="cover"
            />
          </Pressable>
        ) : (
          <Pressable
            onPress={handleImageUpload}
            className="mt-4 h-[254px] w-[254px] items-center justify-center self-center rounded-lg border-2 border-dashed border-gray-400">
            <Text className="text-text">Upload Image</Text>
          </Pressable>
        )}
        <Pressable onPress={handleCreateAnnouncement} className="rounded-lg bg-green-500 px-4 py-2">
          <Text className="text-center text-white">Create Announcement</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default CreateAnnouncementScreen;
