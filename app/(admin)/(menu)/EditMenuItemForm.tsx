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

const EditMenuItemForm = () => {
  const {
    id,
    menuName,
    menuDescription,
    menuPrice,
    menuImageUrl,
    menuAvailable,
    menuCategory,
    index,
  } = useLocalSearchParams();

  const [name, setName] = useState<string>(menuName as string);
  const [description, setDescription] = useState<string>(menuDescription as string);
  const [price, setPrice] = useState<string>(menuPrice?.toString());
  const [available, setAvailable] = useState<boolean>(menuAvailable === 'true');
  const [category, setCategory] = useState<Category>(menuCategory as Category);
  const [imageUrl, setImageUrl] = useState<string>(
    (menuImageUrl as string)?.replace('/o/menu/', '/o/menu%2F')
  );
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

  const handleSubmit = async () => {
    setLoading(true);
    if (!price || !name || !description) {
      Alert.alert('Error', 'Please fill in all 3 input fields.');
      return;
    }

    try {
      if (blob) {
        const imageRef = ref(FIREBASE_STR, `menu/${id}`);
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

        const updatedMenuItem: MenuItem = {
          name,
          description,
          price: parseFloat(price),
          available,
          category,
          id: id as string,
          imageUrl: downloadUrl as string,
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
          imageUrl: imageUrl,
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
      <SafeAreaView className="flex-1 bg-background p-4">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <ScrollView>
            <BackButton />
            <View className="flex-1 items-center justify-center ">
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
                className="h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-primary">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-bold text-white">Update Item</Text>
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

export default EditMenuItemForm;
