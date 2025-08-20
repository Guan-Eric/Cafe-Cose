import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  SafeAreaView,
  TouchableOpacity,
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
import { notifyAnnouncement } from 'backend/notification';
import { deletePromotion, editPromotion } from 'backend/promotion';

const EditAnnouncementScreen = () => {
  const { id, title, message, notificationMessage, imageUrl, createdAt } = useLocalSearchParams();

  const [promotionTitle, setTitle] = useState<string>(title as string);
  const [promotionMessage, setMessage] = useState<string>(message as string);
  const [notification, setNotification] = useState<string>(notificationMessage as string);
  const [image, setImage] = useState<string>(
    (imageUrl as string)?.replace('/o/promotions/', '/o/promotions%2F')
  );
  const [promotionDate, setPromotionDate] = useState<Date>(new Date(createdAt as string));
  const [blob, setBlob] = useState<Blob>();
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false,
      aspect: [16, 9],
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
    if (!promotionTitle) {
      Alert.alert('Error', 'Please fill in the title field.');
      return;
    }

    try {
      if (blob) {
        const imageRef = ref(FIREBASE_STR, `promotions/${id}`);
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

        const updatedPromotion = {
          id: id as string,
          title: promotionTitle,
          message: promotionMessage,
          notificationMessage: notification,
          imageUrl: downloadUrl as string,
          createdAt: promotionDate,
        };
        await editPromotion(updatedPromotion);
      } else {
        const updatedAnnouncement = {
          id: id as string,
          title: promotionTitle,
          message: promotionMessage,
          notificationMessage: notification,
          imageUrl: image,
          createdAt: promotionDate,
        };
        await editPromotion(updatedAnnouncement);
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
        await notifyAnnouncement(promotionTitle, notification);
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
        await deletePromotion(id as string);
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
            <BackButton />
            <View className="flex-1 items-center justify-center ">
              <View className="items-center pb-[30px]">
                <Text className="self-center font-sans text-4xl text-text">Edit Announcement</Text>
              </View>
              <View className="pb-[30px]">
                <View className="h-[60px] w-[254px]">
                  <Text className="font-sans text-text">Title</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-sans text-text"
                    value={promotionTitle}
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
                <View className="mt-3 h-[100px] w-[254px]">
                  <Text className="font-sans text-text">Message</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-sans text-text"
                    value={promotionMessage}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                {image ? (
                  <TouchableOpacity
                    onPress={handleImageUpload}
                    className="mt-4 h-[254px] w-[254px] items-center justify-center self-center">
                    <Image
                      source={{ uri: image }}
                      className="h-full w-full rounded-lg"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleImageUpload}
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
