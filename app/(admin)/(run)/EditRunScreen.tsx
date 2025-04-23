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
  Switch,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { RSVPStatus, Run, User } from 'components/types';
import * as ImagePicker from 'expo-image-picker';
import BackButton from 'components/BackButton';
import { createRun, deleteRun, editRun } from 'backend/run';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STR } from 'firebaseConfig';
import { format } from 'date-fns';

const EditRunScreen = () => {
  const {
    id,
    runTitle,
    runMessage,
    runNotificationMessage,
    runImageUrl,
    runDate,
    runIsRSVP,
    runRsvps,
  } = useLocalSearchParams();

  const [title, setTitle] = useState<string>(runTitle as string);
  const [message, setMessage] = useState<string>(runMessage as string);
  const [notificationMessage, setNotificationMessage] = useState<string>(
    runNotificationMessage as string
  );
  const [imageUrl, setImageUrl] = useState<string>(
    (runImageUrl as string)?.replace('/o/runs/', '/o/runs%2F')
  );
  const [date, setDate] = useState<Date>(new Date(runDate as string));
  const [participants, setParticipants] = useState<User[]>([]);
  const [isRSVP, setIsRSVP] = useState<boolean>(runIsRSVP === 'true');
  const [rsvps, setRsvps] = useState<{ [userId: string]: RSVPStatus }>(
    runRsvps
      ? (Object.fromEntries(Object.entries(runRsvps)) as { [userId: string]: RSVPStatus })
      : {}
  );
  const [blob, setBlob] = useState<Blob | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
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

  const handleUpdateRun = async () => {
    setLoading(true);
    if (!title || !message || !notificationMessage) {
      Alert.alert('Error', 'Please fill in all 3 input fields.');
      return;
    }

    try {
      if (blob) {
        const imageRef = ref(FIREBASE_STR, `runs/${id}`);
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

        const updatedRun = {
          id: id as string,
          title: title,
          message: message,
          notificationMessage: notificationMessage,
          date: date,
          imageUrl: downloadUrl as string,
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
          imageUrl: imageUrl,
          isRSVP: isRSVP,
          rsvps: rsvps,
        };
        editRun(updatedRun);
      }
      Alert.alert('Success', 'Updated run');
      setLoading(false);
      router.back();
    } catch (error) {
      console.error('Error creating run:', error);
      Alert.alert('Error', 'Cannot create run');
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
        await deleteRun(id as string);
        Alert.alert('Success', 'Run deleted successfully!');
      } catch (error) {
        console.error('Error deleting run:', error);
        Alert.alert('Error', 'Failed to delete run.');
      } finally {
        router.back();
      }
    }
  };

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-background p-4">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <ScrollView>
            <View className="flex-row items-center">
              <BackButton />
              <Text className="text-2xl font-bold text-text">Edit Run</Text>
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
              <View className="mt-3">
                <Text className="mb-2 font-[Lato_400Regular] text-text">Date & Time</Text>
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
                <Text className="font-[Lato_400Regular] text-text">RSVP?</Text>
                <Switch value={isRSVP} onValueChange={setIsRSVP} className="ml-2" />
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
                onPress={handleUpdateRun}
                className="mt-10 h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-primary">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-[Lato_400Regular] text-white">Update Run</Text>
                )}
              </Pressable>
              <Pressable
                onPress={handleDelete}
                className="mb-4 mt-10 h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-red-500">
                <Text className="font-bold text-white">Delete Item</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default EditRunScreen;
