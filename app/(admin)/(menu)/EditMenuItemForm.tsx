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
  Switch,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { deleteMenuItem, editMenuItem } from 'backend/menu';
import { router, useLocalSearchParams } from 'expo-router';
import { Category, MenuItem } from 'components/types';
import BackButton from 'components/BackButton';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STR } from 'firebaseConfig';
import { handleImageUpload } from 'backend/image';
import ImageCarousel from 'components/ImageCarousel';

const EditMenuItemForm = () => {
  const {
    id,
    menuName,
    menuDescription,
    menuPrice,
    menuImageUrls,
    menuAvailable,
    menuCategory,
    index,
  } = useLocalSearchParams();

  const [name, setName] = useState<string>(menuName as string);
  const [description, setDescription] = useState<string>(menuDescription as string);
  const [price, setPrice] = useState<string>(menuPrice?.toString());
  const [available, setAvailable] = useState<boolean>(menuAvailable === 'true');
  const [category, setCategory] = useState<Category>(menuCategory as Category);
  const updatedImageUrl = (menuImageUrls as string)?.replaceAll('/o/menu/', '/o/menu%2F');
  const [imageUrls, setImageUrls] = useState<string[]>(updatedImageUrl.split(','));
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (!price || !name || !description) {
      Alert.alert('Error', 'Please fill in all 3 input fields.');
      return;
    }

    try {
      if (blobs.length > 0) {
        const downloadUrls = [];
        for (let i = 0; i < blobs.length; i++) {
          const imageRef = ref(FIREBASE_STR, `menu/${id}_${i}`);
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

        const updatedMenuItem: MenuItem = {
          name,
          description,
          price: parseFloat(price),
          available,
          category,
          id: id as string,
          imageUrls: downloadUrls as string[],
          index: Number(index),
        };
        await editMenuItem(updatedMenuItem);
      } else {
        const updatedMenuItem: MenuItem = {
          name,
          description,
          price: parseFloat(price),
          available,
          category,
          id: id as string,
          imageUrls: imageUrls,
          index: Number(index),
        };
        await editMenuItem(updatedMenuItem);
      }
      setLoading(false);
      Alert.alert('Success', 'Menu item updated successfully!');
      router.back();
    } catch (error) {
      console.error('Error updating menu item:', error);
      Alert.alert('Error', 'Failed to update menu item.');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this menu item?',
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
        await deleteMenuItem(id as string);
        Alert.alert('Success', 'Menu item deleted successfully!');
      } catch (error) {
        console.error('Error deleting menu item:', error);
        Alert.alert('Error', 'Failed to delete menu item.');
      } finally {
        router.back();
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <ScrollView>
            <BackButton />
            <View className="flex-1 items-center justify-center ">
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
                  <ImageCarousel data={imageUrls} width={254} />
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
                disabled={loading || !(description && name && price)}
                className={`h-[42px] w-[240px] items-center justify-center rounded-[20px] ${loading || !(description && name && price) ? 'bg-gray-400' : 'bg-primary'}`}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-sans text-white">Update Item</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                disabled={loading}
                className={`mb-4 mt-10 h-[42px] w-[240px] items-center justify-center rounded-[20px] ${loading ? 'bg-gray-400' : 'bg-red-500'}`}>
                <Text className="font-sans text-white">Delete Item</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default EditMenuItemForm;
