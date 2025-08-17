import React, { useState } from 'react';
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
  ActivityIndicator,
  ScrollView,
  Image,
  Switch,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import BackButton from 'components/BackButton';
import { addMenuItem, editMenuItem } from 'backend/menu';
import { router } from 'expo-router';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { FIREBASE_STR } from 'firebaseConfig';
import { Category, MenuItem } from 'components/types';
import ImageCarousel from 'components/ImageCarousel';
import { handleImageUpload } from 'backend/image';

interface AddMenuItemFormProps {
  onClose: () => void;
}

const AddMenuItemForm: React.FC<AddMenuItemFormProps> = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [blobs, setBlobs] = useState<Blob[]>([]);
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
        imageUrls,
        category,
      };
      const menuItem = await addMenuItem(menuItemData);
      const downloadUrls = [];
      for (let i = 0; i < blobs.length; i++) {
        const imageRef = ref(FIREBASE_STR, `menu/${menuItem.id}_${i}`);
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
        const updatedMenuItem = { ...menuItem, imageUrls: (downloadUrls as string[]) || [] };
        editMenuItem(updatedMenuItem);
      }
      Alert.alert('Success', 'Menu item added successfully!');
      router.back();
    } catch (error) {
      console.error('Error adding menu item:', error);
      Alert.alert('Error', 'Failed to add menu item.');
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <ScrollView>
            <BackButton />
            <View className="flex-1 items-center justify-center">
              <View className="items-center pb-[30px]">
                <Text className="self-center font-sans text-4xl text-text">Add Menu Item</Text>
              </View>
              <View className="pb-[30px]">
                <View className="h-[60px] w-[254px]">
                  <Text className="font-sans text-text">Name</Text>
                  <TextInput
                    className="text-m bg-input mt-2 flex-1 rounded-[10px] px-[10px] font-sans text-text"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    placeholderTextColor="gray"
                  />
                </View>

                <View className="mt-3 h-[60px] w-[254px]">
                  <Text className="font-sans text-text">Price</Text>
                  <TextInput
                    className="text-m bg-input mt-2 flex-1 rounded-[10px] px-[10px] font-sans text-text"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    placeholderTextColor="gray"
                  />
                </View>

                <View className="mt-3 h-[100px] w-[254px]">
                  <Text className="font-sans text-text">Description</Text>
                  <TextInput
                    className="text-m bg-input mt-2 flex-1 rounded-[10px] px-[10px] font-sans text-text"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    placeholderTextColor="gray"
                  />
                </View>
                <View className="mt-3 w-[254px]">
                  <Text className="font-sans text-text">Category</Text>
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
                  <Text className="font-sans text-text">Available</Text>
                  <Switch value={available} onValueChange={setAvailable} className="ml-2" />
                </View>
                {imageUrls.length > 0 ? (
                  <Pressable onPress={() => handleImageUpload(setBlobs, setImageUrls)}>
                    <ImageCarousel data={imageUrls} width={254} />
                  </Pressable>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleImageUpload(setBlobs, setImageUrls)}
                    className="mt-4 h-[254px] w-[254px] items-center justify-center self-center rounded-lg border-2 border-dashed border-gray-400">
                    <Text className="text-text">Upload Image</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading || !(description && name && price)}
                className={`h-[42px] w-[240px] items-center justify-center rounded-[20px] ${loading || !(description && name && price) ? 'bg-gray-400' : 'bg-primary'}`}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-sans text-white">Add Item</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default AddMenuItemForm;
