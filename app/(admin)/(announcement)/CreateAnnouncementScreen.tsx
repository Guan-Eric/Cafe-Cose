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
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Announcement } from 'components/types';
import * as ImagePicker from 'expo-image-picker';
import BackButton from 'components/BackButton';
import { createAnnouncement, editAnnouncement } from 'backend/announcement';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STR } from 'firebaseConfig';
import { notifyAnnouncement } from 'backend/notification';
import { handleImageUpload } from 'backend/image';
import ImageCarousel from 'components/ImageCarousel';

const CreateAnnouncementScreen = () => {
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateAnnouncement = async () => {
    setLoading(true);
    if (!title) {
      Alert.alert('Error', 'Please fill in the title field.');
      return;
    }

    const newAnnouncementData: Partial<Announcement> = {
      title,
      message,
      notificationMessage,
      createdAt: new Date(),
      imageUrls,
    };
    try {
      const newAnnouncement = await createAnnouncement(newAnnouncementData);
      const downloadUrls = [];
      for (let i = 0; i < blobs.length; i++) {
        const imageRef = ref(FIREBASE_STR, `announcements/${newAnnouncement.id}_${i}`);
        const uploadTask = uploadBytesResumable(imageRef, blobs[i]);

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
        downloadUrls.push(downloadUrl);
      }
      if (blobs.length > 0) {
        const updatedAnnouncement = {
          ...newAnnouncement,
          imageUrls: (downloadUrls as string[]) || [],
        };
        editAnnouncement(updatedAnnouncement);
      }
      setLoading(false);
      await sendNotificationAlert();
      router.back();
    } catch (error) {
      console.error('Error creating announcement:', error);
      Alert.alert('Error', 'Cannot create announcement');
    }
  };

  const sendNotificationAlert = async () => {
    const confirmSend = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Send Notification',
        'Do you want to send a notification for this announcement?',
        [
          {
            text: 'Cancel',
            onPress: () => resolve(false),
            style: 'cancel',
          },
          {
            text: 'Send',
            onPress: () => resolve(true),
            style: 'default',
          },
        ],
        { cancelable: false }
      );
    });

    if (confirmSend) {
      try {
        await notifyAnnouncement(title, notificationMessage);
        Alert.alert('Success', 'Notification sent successfully!');
      } catch (error) {
        console.error('Error sending notification:', error);
        Alert.alert('Error', 'Failed to send notification.');
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <ScrollView>
            <View className="flex-row items-center">
              <BackButton />
              <Text className="font-sans text-2xl text-text">Create Announcement</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <View className="h-[60px] w-[254px]">
                <Text className="font-sans text-text">Title</Text>
                <TextInput
                  value={title}
                  maxLength={40}
                  onChangeText={setTitle}
                  className="text-m bg-input mt-2 flex-1 rounded-[10px] px-[10px] font-sans text-text"
                />
              </View>
              <View className="mt-3 h-[60px] w-[254px]">
                <Text className="font-sans text-text">Notification Message</Text>
                <TextInput
                  value={notificationMessage}
                  maxLength={120}
                  onChangeText={setNotificationMessage}
                  className="text-m bg-input mt-2 flex-1 rounded-[10px] px-[10px] font-sans text-text"
                />
              </View>
              <View className="mt-3 h-[180px] w-[254px]">
                <Text className="font-sans text-text">Message</Text>
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  className="text-m bg-input mt-2 flex-1 rounded-[10px] px-[10px] font-sans text-text"
                />
              </View>

              {imageUrls.length > 0 ? (
                <Pressable onPress={() => handleImageUpload(setBlobs, setImageUrls)}>
                  <ImageCarousel data={imageUrls} width={254} />
                </Pressable>
              ) : (
                <TouchableOpacity
                  onPress={() => handleImageUpload(setBlobs, setImageUrls)}
                  className="mt-4 h-[254px] w-[254px] items-center justify-center self-center rounded-lg border-2 border-dashed border-gray-400">
                  <Text className="font-sans text-text">Upload Image</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleCreateAnnouncement}
                className="mt-10 h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-primary">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-sans text-white">Create Announcement</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CreateAnnouncementScreen;
