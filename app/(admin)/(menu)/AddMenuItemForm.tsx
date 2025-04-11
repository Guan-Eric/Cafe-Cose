import React, { useState } from 'react';
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
  ActivityIndicator,
  ScrollView,
  Image,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import BackButton from 'components/BackButton';
import { addMenuItem, editMenuItem } from 'backend/menu';
import { router } from 'expo-router';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { FIREBASE_STR } from 'firebaseConfig';
import { Category, MenuItem } from 'components/types';

interface AddMenuItemFormProps {
  onClose: () => void;
}

const AddMenuItemForm: React.FC<AddMenuItemFormProps> = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [blob, setBlob] = useState<Blob>();
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState<boolean>(true);
  const [category, setCategory] = useState<Category>(Category.Coffee);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const menuItemData: Partial<MenuItem> = {
        name,
        description,
        price: parseFloat(price),
        available: available,
        imageUrl,
        category,
      };
      const menuItem = await addMenuItem(menuItemData);
      const imageRef = ref(FIREBASE_STR, `posts/${menuItem.id}`);
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

      const updatedMenuItem = { ...menuItem, imageUrl: downloadUrl as string };
      editMenuItem(updatedMenuItem);
      Alert.alert('Success', 'Menu item added successfully!');
      router.back();
    } catch (error) {
      console.error('Error adding menu item:', error);
      Alert.alert('Error', 'Failed to add menu item.');
    } finally {
      setLoading(false);
    }
  };

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
        Alert.alert('Error', 'Cannot upload image');
      }
    } else {
      Alert.alert('Image selection was canceled.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-background p-4">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <ScrollView>
            <BackButton />
            <View className="flex-1 items-center justify-center">
              <View className="items-center pb-[30px]">
                <Text className="self-center text-4xl font-[Lato_400Regular] text-text">
                  Add Menu Item
                </Text>
              </View>
              <View className="pb-[30px]">
                <View className="h-[60px] w-[254px]">
                  <Text className="font-[Lato_400Regular] text-text">Name</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-[Lato_400Regular] text-text"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    placeholderTextColor="gray"
                  />
                </View>

                <View className="mt-3 h-[60px] w-[254px]">
                  <Text className="font-[Lato_400Regular] text-text">Price</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-[Lato_400Regular] text-text"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    placeholderTextColor="gray"
                  />
                </View>

                <View className="mt-3 h-[100px] w-[254px]">
                  <Text className="font-[Lato_400Regular] text-text">Description</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-[Lato_400Regular] text-text"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    placeholderTextColor="gray"
                  />
                </View>
                <View className="mt-3 w-[254px]">
                  <Text className="font-[Lato_400Regular] text-text">Category</Text>
                  <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue as Category)}
                    style={{
                      marginBottom: -30,
                      width: 254,
                    }}
                    itemStyle={{ fontSize: 16, fontFamily: 'Lato_400Regular' }}>
                    <Picker.Item label="Coffee" value={Category.Coffee} />
                    <Picker.Item label="Tea" value={Category.Tea} />
                    <Picker.Item label="Specialty" value={Category.Specialty} />
                    <Picker.Item label="Smoothie" value={Category.Smoothie} />
                    <Picker.Item label="Food" value={Category.Food} />
                    <Picker.Item label="Pastry" value={Category.Pastry} />
                  </Picker>
                </View>
                <View className="mt-3 h-[60px] w-[254px] flex-row items-center justify-between">
                  <Text className="font-[Lato_400Regular] text-text">Available</Text>
                  <Switch value={available} onValueChange={setAvailable} className="ml-2" />
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
              </View>

              <Pressable
                onPress={handleSubmit}
                disabled={loading || !(description && name && price && imageUrl)}
                className={`h-[42px] w-[240px] items-center justify-center rounded-[20px] ${loading || !(description && name && price && imageUrl) ? 'bg-gray-400' : 'bg-primary'}`}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-[Lato_400Regular] text-white">Add Item</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default AddMenuItemForm;
