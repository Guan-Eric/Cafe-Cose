import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Announcement } from 'components/types';
import * as ImagePicker from 'expo-image-picker';
import BackButton from 'components/BackButton';
import { createAnnouncement, editAnnouncement } from 'backend/announcement';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STR } from 'firebaseConfig';

const CreateAnnouncementScreen = () => {
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [blob, setBlob] = useState<Blob>();
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleCreateAnnouncement = async () => {
    setLoading(true);
    if (!title || !message || !notificationMessage) {
      Alert.alert('Error', 'Please fill in all 3 input fields.');
      return;
    }

    const newAnnouncementData: Partial<Announcement> = {
      title,
      message,
      notificationMessage,
      createdAt: new Date(),
      imageUrl,
    };
    try {
      const newAnnouncement = await createAnnouncement(newAnnouncementData);
      const imageRef = ref(FIREBASE_STR, `announcements/${newAnnouncement.id}`);
      const uploadTask = uploadBytesResumable(imageRef, blob as Blob);

      const downloadUrl = await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            console.error(`Error uploading image:`, error);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      const updatedAnnouncement = { ...newAnnouncement, imageUrl: downloadUrl as string };
      editAnnouncement(updatedAnnouncement);
      Alert.alert('Success', 'Created announcement');
      setLoading(false);
      router.back();
    } catch (error) {
      console.error('Error creating announcement:', error);
      Alert.alert('Error', 'Cannot create announcement');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-background p-4">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <ScrollView>
            <View className="flex-row items-center">
              <BackButton />
              <Text className="text-2xl font-bold text-text">Create Announcement</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <View className="h-[60px] w-[254px]">
                <Text className="font-[Lato_400Regular] text-text">Title</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-[Lato_400Regular] text-text"
                />
              </View>
              <View className="mt-3 h-[60px] w-[254px]">
                <Text className="font-[Lato_400Regular] text-text">Notification Message</Text>
                <TextInput
                  value={notificationMessage}
                  onChangeText={setNotificationMessage}
                  className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-[Lato_400Regular] text-text"
                />
              </View>
              <View className="mt-3 h-[180px] w-[254px]">
                <Text className="font-[Lato_400Regular] text-text">Message</Text>
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-[Lato_400Regular] text-text"
                />
              </View>

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
              <Pressable
                onPress={handleCreateAnnouncement}
                className="mt-10 h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-primary">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-[Lato_400Regular] text-white">Create Announcement</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CreateAnnouncementScreen;
