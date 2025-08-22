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
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Promotion } from 'components/types';
import * as ImagePicker from 'expo-image-picker';
import BackButton from 'components/BackButton';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STR } from 'firebaseConfig';
import { notifyPromotion } from 'backend/notification';
import { createPromotion, editPromotion } from 'backend/promotion';

const CreatePromotionScreen = () => {
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [blob, setBlob] = useState<Blob>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false,
      aspect: [1, 1],
      allowsEditing: true,
      quality: 1,
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

  const handleCreatePromotion = async () => {
    setLoading(true);
    if (!title) {
      Alert.alert('Error', 'Please fill in the title field.');
      return;
    }

    const newPromotionData: Partial<Promotion> = {
      title,
      message,
      notificationMessage,
      createdAt: new Date(),
      imageUrl,
    };
    try {
      const newPromotion = await createPromotion(newPromotionData);
      const imageRef = ref(FIREBASE_STR, `promotions/${newPromotion.id}`);
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

      const updatedPromotion = { ...newPromotion, imageUrl: downloadUrl as string };
      editPromotion(updatedPromotion);
      setLoading(false);
      await sendNotificationAlert();
      router.back();
    } catch (error) {
      console.error('Error creating Promotion:', error);
      Alert.alert('Error', 'Cannot create Promotion');
    }
  };

  const sendNotificationAlert = async () => {
    const confirmSend = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Send Notification',
        'Do you want to send a notification for this Promotion?',
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
        await notifyPromotion(title, notificationMessage);
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
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled">
            <View className="flex-row items-center">
              <BackButton color="#3C2A20" />
              <Text className="font-sans text-2xl text-text">Create Promotion</Text>
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

              {imageUrl ? (
                <TouchableOpacity
                  onPress={handleImageUpload}
                  className="mt-4 h-[254px] w-[254px] items-center justify-center self-center">
                  <Image
                    source={{ uri: imageUrl }}
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
              <TouchableOpacity
                onPress={handleCreatePromotion}
                className="mt-10 h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-primary">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-sans text-white">Create Promotion</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CreatePromotionScreen;
