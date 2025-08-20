import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Switch,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { RSVPStatus, User } from 'components/types';
import * as ImagePicker from 'expo-image-picker';
import BackButton from 'components/BackButton';
import { deleteRun, editRun } from 'backend/run';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STR } from 'firebaseConfig';
import { notifyRun } from 'backend/notification';
import ImageCarousel from 'components/ImageCarousel';
import { handleImageUpload } from 'backend/image';

const EditRunScreen = () => {
  const {
    id,
    runTitle,
    runMessage,
    runNotificationMessage,
    runImageUrls,
    runDate,
    runIsRSVP,
    runRsvps,
  } = useLocalSearchParams();

  const [title, setTitle] = useState<string>(runTitle as string);
  const [message, setMessage] = useState<string>(runMessage as string);
  const [notificationMessage, setNotificationMessage] = useState<string>(
    runNotificationMessage as string
  );
  const updatedImageUrl = (runImageUrls as string)?.replaceAll('/o/runs/', '/o/runs%2F');
  const [imageUrls, setImageUrls] = useState<string[]>(updatedImageUrl.split(','));
  const [date, setDate] = useState<Date>(new Date(runDate as string));
  const [participants, setParticipants] = useState<User[]>([]);
  const [isRSVP, setIsRSVP] = useState<boolean>(runIsRSVP === 'true');
  const [rsvps, setRsvps] = useState<{ [userId: string]: RSVPStatus }>(
    runRsvps
      ? (Object.fromEntries(Object.entries(runRsvps)) as { [userId: string]: RSVPStatus })
      : {}
  );
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteloading, setDeleteLoading] = useState<boolean>(false);

  const handleUpdateRun = async () => {
    setLoading(true);
    if (!title) {
      Alert.alert('Error', 'Please fill in the title field.');
      setLoading(false);
      return;
    }

    try {
      if (blobs.length > 0) {
        const downloadUrls = [];
        for (let i = 0; i < blobs.length; i++) {
          const imageRef = ref(FIREBASE_STR, `runs/${id}_${i}`);
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
        console.log(downloadUrls);
        const updatedRun = {
          id: id as string,
          title: title,
          message: message,
          notificationMessage: notificationMessage,
          date: date,
          imageUrl: downloadUrls as string[],
          isRSVP: isRSVP,
          rsvps: rsvps,
        };
        editRun(updatedRun);
      } else {
        const updatedRun = {
          id: id as string,
          title: title,
          message: message,
          notificationMessage: notificationMessage,
          date: date,
          imageUrl: imageUrls,
          isRSVP: isRSVP,
          rsvps: rsvps,
        };
        editRun(updatedRun);
      }
      setLoading(false);
      await sendNotificationAlert();
      router.back();
    } catch (error) {
      console.error('Error editing run:', error);
      Alert.alert('Error', 'Cannot editing run');
      setLoading(false);
    }
  };

  const sendNotificationAlert = async () => {
    const confirmSend = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Send Notification',
        'Do you want to send a notification for this run?',
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
        await notifyRun(title, notificationMessage);
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
        'Are you sure you want to delete this run?',
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
        setDeleteLoading(true);
        await deleteRun(id as string);
        Alert.alert('Success', 'Run deleted successfully!');
        setDeleteLoading(false);
      } catch (error) {
        console.error('Error deleting run:', error);
        Alert.alert('Error', 'Failed to delete run.');
        setDeleteLoading(false);
      } finally {
        router.back();
      }
    }
  };

  const handleDuplicateRun = () => {
    router.push({
      pathname: '/(admin)/(run)/CreateRunScreen',
      params: {
        runTitle: title,
        runMessage: message,
        runNotificationMessage: notificationMessage,
        runIsRSVP: isRSVP.toString(),
      },
    });
  };

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled">
          <View className="flex-row items-center">
            <BackButton />
            <Text className="font-sans text-2xl text-text">Edit Run</Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <View className="h-[60px] w-[254px]">
              <Text className="font-sans text-text">Title</Text>
              <TextInput
                value={title}
                maxLength={40}
                onChangeText={setTitle}
                className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-sans text-text"
              />
            </View>
            <View className="mt-3 h-[60px] w-[254px]">
              <Text className="font-sans text-text">Notification Message</Text>
              <TextInput
                value={notificationMessage}
                maxLength={120}
                onChangeText={setNotificationMessage}
                className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-sans text-text"
              />
            </View>
            <View className="mt-3 h-[180px] w-[254px]">
              <Text className="font-sans text-text">Message</Text>
              <TextInput
                value={message}
                onChangeText={setMessage}
                multiline
                className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-sans text-text"
              />
            </View>
            <View className="mt-3">
              <Text className="mb-2 font-sans text-text">Date & Time</Text>
              <View className="h-12 w-[254px] justify-center rounded-md  px-3">
                <DateTimePicker
                  value={date || new Date()}
                  mode="datetime"
                  display="default"
                  textColor="#1a1a1a"
                  accentColor="#762e1f"
                  onChange={onChangeDate}
                  style={{ width: '100%' }}
                />
              </View>
            </View>
            <View className="mt-3 h-[60px] w-[254px] flex-row items-center justify-between">
              <Text className="font-sans text-text">RSVP?</Text>
              <Switch value={isRSVP} onValueChange={setIsRSVP} className="ml-2" />
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
            <TouchableOpacity
              onPress={handleDuplicateRun}
              className="mt-10 h-[42px] w-[240px] items-center justify-center rounded-[20px] border-2 border-primary bg-background">
              <Text className="font-sans text-primary">Duplicate Run</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleUpdateRun}
              disabled={loading}
              className={`mt-10 h-[42px] w-[240px] items-center justify-center rounded-[20px] ${loading ? 'bg-gray-400' : 'bg-primary'}`}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="font-sans text-white">Update Run</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              disabled={deleteloading}
              className={`mb-4 mt-10 h-[42px] w-[240px] items-center justify-center rounded-[20px] ${deleteloading ? 'bg-gray-400' : 'bg-red-500'}`}>
              {deleteloading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="font-sans text-white">Delete Item</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default EditRunScreen;
