import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Switch,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import BackButton from 'components/BackButton';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STR } from 'firebaseConfig';
import { editAnnouncement, deleteAnnouncement } from 'backend/announcement';
import { notifyAnnouncement } from 'backend/notification';
import ImageCarousel from 'components/ImageCarousel';
import { handleImageUpload } from 'backend/image';

const EditAnnouncementScreen = () => {
  const { id, title, message, notificationMessage, announcementImageUrls, createdAt } =
    useLocalSearchParams();

  const [announcementTitle, setTitle] = useState<string>(title as string);
  const [announcementMessage, setMessage] = useState<string>(message as string);
  const [notification, setNotification] = useState<string>(notificationMessage as string);
  const updatedImageUrl = (announcementImageUrls as string)?.replaceAll(
    '/o/announcements/',
    '/o/announcements%2F'
  );
  const [imageUrls, setImageUrls] = useState<string[]>(updatedImageUrl.split(','));
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [announcementDate, setAnnouncementDate] = useState<Date>(new Date(createdAt as string));

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (!announcementTitle) {
      Alert.alert('Error', 'Please fill in the title field.');
      return;
    }

    try {
      if (blobs.length > 0) {
        const downloadUrls = [];
        for (let i = 0; i < blobs.length; i++) {
          const imageRef = ref(FIREBASE_STR, `announcements/${id}_${i}`);
          const uploadTask = uploadBytesResumable(imageRef, blobs[i] as Blob);

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

        const updatedAnnouncement = {
          id: id as string,
          title: announcementTitle,
          message: announcementMessage,
          notificationMessage: notification,
          imageUrls: (downloadUrls as string[]) || [],
          createdAt: announcementDate,
        };
        await editAnnouncement(updatedAnnouncement);
      } else {
        const updatedAnnouncement = {
          id: id as string,
          title: announcementTitle,
          message: announcementMessage,
          notificationMessage: notification,
          imageUrls: imageUrls,
          createdAt: announcementDate,
        };
        await editAnnouncement(updatedAnnouncement);
      }
      setLoading(false);
      await sendNotificationAlert();
      router.back();
    } catch (error) {
      console.error('Error updating announcement:', error);
      Alert.alert('Error', 'Failed to update announcement.');
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
        await notifyAnnouncement(announcementTitle, notification);
        Alert.alert('Success', 'Notification sent successfully!');
      } catch (error) {
        console.error('Error sending notification:', error);
        Alert.alert('Error', 'Failed to send notification.');
      }
    }
  };

  const handleDelete = async () => {
    const confirmDelete = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this announcement?',
        [
          {
            text: 'Cancel',
            onPress: () => resolve(false),
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => resolve(true),
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    });

    if (confirmDelete) {
      try {
        await deleteAnnouncement(id as string);
        Alert.alert('Success', 'Announcement deleted successfully!');
      } catch (error) {
        console.error('Error deleting announcement:', error);
        Alert.alert('Error', 'Failed to delete announcement.');
      } finally {
        router.back();
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled">
            <BackButton color="#3C2A20" />
            <View className="flex-1 items-center justify-center ">
              <View className="items-center pb-[30px]">
                <Text className="self-center font-sans text-4xl text-text">Edit Announcement</Text>
              </View>
              <View className="pb-[30px]">
                <View className="h-[60px] w-[254px]">
                  <Text className="font-sans text-text">Title</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-sans text-text"
                    value={announcementTitle}
                    onChangeText={setTitle}
                    maxLength={40}
                  />
                </View>
                <View className="mt-3 h-[60px] w-[254px]">
                  <Text className="font-sans text-text">Notification Message</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-sans text-text"
                    value={notification}
                    onChangeText={setNotification}
                    maxLength={120}
                  />
                </View>
                <View className="my-3 h-[100px] w-[254px]">
                  <Text className="font-sans text-text">Message</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-sans text-text"
                    value={announcementMessage}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                {imageUrls.length > 0 ? (
                  <TouchableOpacity onPress={() => handleImageUpload(setBlobs, setImageUrls)}>
                    <ImageCarousel data={imageUrls} width={254} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleImageUpload(setBlobs, setImageUrls)}
                    className="mt-4 h-[254px] w-[254px] items-center justify-center self-center rounded-lg border-2 border-dashed border-gray-400">
                    <Text className="font-sans text-text">Upload Image</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                onPress={handleSubmit}
                className="h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-primary">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-sans text-white">Update Announcement</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                className="mb-4 mt-10 h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-red-500">
                <Text className="font-sans text-white">Delete Announcement</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default EditAnnouncementScreen;
