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
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import BackButton from 'components/BackButton';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STR } from 'firebaseConfig';
import { editAnnouncement, deleteAnnouncement } from 'backend/announcement';
import { notifyAnnouncement } from 'backend/notification';

const EditAnnouncementScreen = () => {
  const { id, title, message, notificationMessage, imageUrl, createdAt } = useLocalSearchParams();

  const [announcementTitle, setTitle] = useState<string>(title as string);
  const [announcementMessage, setMessage] = useState<string>(message as string);
  const [notification, setNotification] = useState<string>(notificationMessage as string);
  const [image, setImage] = useState<string>(
    (imageUrl as string)?.replace('/o/announcements/', '/o/announcements%2F')
  );
  const [announcementDate, setAnnouncementDate] = useState<Date>(new Date(createdAt as string));
  const [blob, setBlob] = useState<Blob>();
  const [loading, setLoading] = useState(false);

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

        setImage(result.assets[0].uri);
        setBlob(blob);
      } catch (error) {
        console.error('Error uploading images:', error);
      }
    } else {
      console.error('Image selection was canceled.');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!announcementTitle) {
      Alert.alert('Error', 'Please fill in the title field.');
      return;
    }

    try {
      if (blob) {
        const imageRef = ref(FIREBASE_STR, `announcements/${id}`);
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

        const updatedAnnouncement = {
          id: id as string,
          title: announcementTitle,
          message: announcementMessage,
          notificationMessage: notification,
          imageUrl: downloadUrl as string,
          createdAt: announcementDate,
        };
        await editAnnouncement(updatedAnnouncement);
      } else {
        const updatedAnnouncement = {
          id: id as string,
          title: announcementTitle,
          message: announcementMessage,
          notificationMessage: notification,
          imageUrl: image,
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
      <SafeAreaView className="flex-1 bg-background p-4">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <ScrollView>
            <BackButton />
            <View className="flex-1 items-center justify-center ">
              <View className="items-center pb-[30px]">
                <Text className="self-center text-4xl font-[Lato_400Regular] text-text">
                  Edit Announcement
                </Text>
              </View>
              <View className="pb-[30px]">
                <View className="h-[60px] w-[254px]">
                  <Text className="font-[Lato_400Regular] text-text">Title</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-[Lato_400Regular] text-text"
                    value={announcementTitle}
                    onChangeText={setTitle}
                    maxLength={40}
                  />
                </View>
                <View className="mt-3 h-[60px] w-[254px]">
                  <Text className="font-[Lato_400Regular] text-text">Notification Message</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-[Lato_400Regular] text-text"
                    value={notification}
                    onChangeText={setNotification}
                    maxLength={120}
                  />
                </View>
                <View className="mt-3 h-[100px] w-[254px]">
                  <Text className="font-[Lato_400Regular] text-text">Message</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-[Lato_400Regular] text-text"
                    value={announcementMessage}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                {image ? (
                  <Pressable
                    onPress={handleImageUpload}
                    className="mt-4 h-[254px] w-[254px] items-center justify-center self-center">
                    <Image
                      source={{ uri: image }}
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
              </View>
              <Pressable
                onPress={handleSubmit}
                className="h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-primary">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-bold text-white">Update Announcement</Text>
                )}
              </Pressable>
              <Pressable
                onPress={handleDelete}
                className="mb-4 mt-10 h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-red-500">
                <Text className="font-bold text-white">Delete Announcement</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default EditAnnouncementScreen;
