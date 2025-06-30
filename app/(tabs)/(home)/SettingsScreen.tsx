import { useState } from 'react';
import { Text, View, Switch, TextInput, Image, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../../components/BackButton';
import * as ImagePicker from 'expo-image-picker';
import { logOut } from 'backend/auth';
import { router, useLocalSearchParams } from 'expo-router';
import { savePushToken, updateUser } from 'backend/user';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FIREBASE_AUTH, FIREBASE_STR } from 'firebaseConfig';
import { requestPermissionsAsync } from 'expo-notifications';
import { registerForPushNotificationsAsync } from 'backend/notification';

function SettingsScreen() {
  const { username, userUrl, userAnnouncement, userRun } = useLocalSearchParams();
  const [name, setName] = useState<string>(username as string);
  const [announcementNotifications, setAnnouncementNotifications] = useState<boolean>(
    (userAnnouncement as string) == 'true'
  );
  const [runNotifications, setRunNotifications] = useState<boolean>((userRun as string) == 'true');
  const [imageUrl, setImageUrl] = useState<string>(
    (userUrl as string)?.replace('/o/profile/', '/o/profile%2F')
  );

  const toggleAnnouncementNotifications = async (value: boolean) => {
    setAnnouncementNotifications(value);
    if (value) {
      const token = await registerForPushNotificationsAsync();
      if (!token) {
        Alert.alert('Permission not granted', 'You will not receive notifications.');
        setAnnouncementNotifications(false);
      } else {
        savePushToken(token);
      }
    }
  };

  const toggleRunNotifications = async (value: boolean) => {
    setRunNotifications(value);
    if (value) {
      const token = await registerForPushNotificationsAsync();
      if (!token) {
        setRunNotifications(false);
      } else {
        savePushToken(token);
      }
    }
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false,
      aspect: [1, 1],
      allowsEditing: true,
      quality: 0.3,
    });

    if (!result.canceled) {
      try {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const imageRef = ref(FIREBASE_STR, `profile/${FIREBASE_AUTH.currentUser?.uid}`);
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
        setImageUrl(downloadUrl as string);
      } catch (error) {
        console.error('Error uploading images:', error);
      }
    } else {
      console.error('Image selection was canceled.');
    }
  };

  const handleSave = async () => {
    try {
      updateUser(name, imageUrl, announcementNotifications, runNotifications);
      Alert.alert('User Updated');
      router.back();
    } catch (error) {
      console.error('Error saving user', error);
    }
  };
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView>
        <View className="flex-row items-center ">
          <BackButton />
          <Text className="text-2xl font-bold text-text">Settings</Text>
        </View>
        <View className="items-center">
          <View className="m-2 w-[90%] rounded-2xl bg-white p-5 shadow-sm">
            <Text className="mb-4 text-lg font-bold">Profile</Text>

            <View className="mb-4 items-center">
              <Pressable onPress={handleImageUpload}>
                <Image source={{ uri: imageUrl }} className="mb-2 h-24 w-24 rounded-full" />
                <Text className="text-center text-blue-500">Change Photo</Text>
              </Pressable>
            </View>

            <View className="mb-2">
              <Text className="mb-1 text-gray-600">Display Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                className="rounded-lg border border-gray-300 p-2"
              />
            </View>
          </View>
          <View className="m-2 w-[90%] rounded-2xl bg-white p-5 shadow-sm">
            <Text className="mb-4 text-lg font-bold">Notifications</Text>

            <View className="mb-4 flex-row items-center justify-between">
              <Text>Announcement Notifications</Text>
              <Switch
                value={announcementNotifications}
                onValueChange={toggleAnnouncementNotifications}
                trackColor={{ false: '#767577', true: '#4CAF50' }}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text>Run Notifications</Text>
              <Switch
                value={runNotifications}
                onValueChange={toggleRunNotifications}
                trackColor={{ false: '#767577', true: '#4CAF50' }}
              />
            </View>
          </View>
        </View>
        <Pressable
          className="m-2 items-center rounded-lg bg-blue-500 p-4"
          onPress={() => {
            handleSave();
          }}>
          <Text className="font-bold text-white">Save Changes</Text>
        </Pressable>
        <Pressable
          className="m-2 items-center rounded-lg bg-red-500 p-4"
          onPress={() => {
            logOut();
          }}>
          <Text className="font-bold text-white">Logout</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

export default SettingsScreen;
