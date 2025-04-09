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
import { editMenuItem } from 'backend/menu';
import { router, useLocalSearchParams } from 'expo-router';
import { Category, MenuItem } from 'components/types';

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
  const [price, setPrice] = useState<string>(menuPrice.toString());
  const [available, setAvailable] = useState<boolean>(menuAvailable === 'true');
  const [category, setCategory] = useState<Category>(menuCategory as Category);
  const [imageUrl, setImageUrl] = useState<string>(menuImageUrl as string);

  const handleSubmit = async () => {
    try {
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
      Alert.alert('Success', 'Menu item updated successfully!');
    } catch (error) {
      console.error('Error updating menu item:', error);
      Alert.alert('Error', 'Failed to update menu item.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-background p-4">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <ScrollView>
            <View className="flex-1 items-center justify-center">
              <Text className="self-center text-4xl font-[Lato_400Regular] text-text">
                Edit Menu Item
              </Text>
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
              </View>

              <Pressable
                onPress={handleSubmit}
                className="h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-primary">
                <Text className="font-[Lato_400Regular] text-white">Update Item</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default EditMenuItemForm;
