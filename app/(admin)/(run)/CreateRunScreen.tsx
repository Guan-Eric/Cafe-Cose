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
import { router } from 'expo-router';
import { Run } from 'components/types';
import * as ImagePicker from 'expo-image-picker';
import BackButton from 'components/BackButton';
import { createRun, editRun } from 'backend/run';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STR } from 'firebaseConfig';
import { notifyRun } from 'backend/notification';

const CreateRunScreen = () => {
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [isRSVP, setIsRSVP] = useState<boolean>(true);
  const [blob, setBlob] = useState<Blob>();
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

        setImageUrl(result.assets[0].uri);
        setBlob(blob);
      } catch (error) {
        console.error('Error uploading images:', error);
      }
    } else {
      console.error('Image selection was canceled.');
    }
  };

  const handleCreateRun = async () => {
    setLoading(true);
    if (!title) {
      Alert.alert('Error', 'Please fill in the title field.');
      return;
    }

    const newRunData: Partial<Run> = {
      title,
      message,
      notificationMessage,
      date,
      isRSVP,
    };

    try {
      const newRun = await createRun(newRunData);
      const imageRef = ref(FIREBASE_STR, `runs/${newRun.id}`);
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

      const updatedRun = { ...newRun, imageUrl: downloadUrl as string };
      editRun(updatedRun);
      setLoading(false);
      await sendNotificationAlert();
      router.back();
    } catch (error) {
      console.error('Error creating run:', error);
      Alert.alert('Error', 'Cannot create run');
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
              <Text className="text-2xl font-bold text-text">Create Run</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <View className="h-[60px] w-[254px]">
                <Text className="font-[Lato_400Regular] text-text">Title</Text>
                <TextInput
                  value={title}
                  maxLength={40}
                  onChangeText={setTitle}
                  className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-[Lato_400Regular] text-text"
                />
              </View>
              <View className="mt-3 h-[60px] w-[254px]">
                <Text className="font-[Lato_400Regular] text-text">Notification Message</Text>
                <TextInput
                  value={notificationMessage}
                  maxLength={120}
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
                onPress={handleCreateRun}
                className="mt-10 h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-primary">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-[Lato_400Regular] text-white">Create Run</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CreateRunScreen;
