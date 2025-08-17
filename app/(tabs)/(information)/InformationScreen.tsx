import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Linking,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const cafeAddress = '1883 Centre St, Montreal, Quebec H3K 1J1';

const openingHours = [
  { day: 'Monday', hours: '8:00 AM - 6:00 PM' },
  { day: 'Tuesday', hours: '8:00 AM - 6:00 PM' },
  { day: 'Wednesday', hours: '8:00 AM - 6:00 PM' },
  { day: 'Thursday', hours: '8:00 AM - 6:00 PM' },
  { day: 'Friday', hours: '8:00 AM - 8:00 PM' },
  { day: 'Saturday', hours: '9:00 AM - 8:00 PM' },
  { day: 'Sunday', hours: '9:00 AM - 4:00 PM' },
];

export default function InformationScreen() {
  const handleOpenMaps = () => {
    const url = `https://maps.app.goo.gl/xvGsoTxq62vBFZ4Y7`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="absolute left-0 right-0 top-0 h-[235px] bg-primary" />
      <ScrollView>
        <Text className="mb-3 pl-4 font-sans text-3xl text-offwhite">Our Location</Text>
        <View className="mb-4 px-4">
          <View className="shadow-lg">
            <TouchableOpacity onPress={handleOpenMaps}>
              <Image source={require('assets/maps.png')} className="h-52 w-full rounded-2xl" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleOpenMaps}
            className="mt-2 flex-row items-center justify-center">
            <MaterialCommunityIcons name="map-marker" size={22} color="#762e1f" />
            <Text className="ml-2 font-sans text-primary">{cafeAddress}</Text>
          </TouchableOpacity>
        </View>

        <Text className="mb-3 mt-2 pl-4 font-sans text-2xl text-primary">Opening Hours</Text>
        <View className="mb-8 rounded-lg px-6">
          {openingHours.map((item) => (
            <View key={item.day} className="w-full flex-row items-center py-1">
              <Text className="flex-1 font-sans text-text">{item.day}</Text>
              <View className="mx-4 h-px flex-1 bg-primary" />
              <Text className="text-right font-sans text-primary">{item.hours}</Text>
            </View>
          ))}
        </View>
        <View>
          <Text className="mb-3 pl-4 font-sans text-2xl text-primary">Contact Us</Text>
          <View className="gap-4 px-6">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => Linking.openURL('tel:+14383807512')}>
              <MaterialCommunityIcons name="phone" size={22} color="#762e1f" />
              <Text className="ml-3 font-sans text-text">+1 (438) 380-7512</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => Linking.openURL('mailto:info@cafecose.com')}>
              <MaterialCommunityIcons name="email" size={22} color="#762e1f" />
              <Text className="ml-3 font-sans text-text">info@cafecose.com</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => Linking.openURL('https://www.instagram.com/cafecose.mtl')}>
              <MaterialCommunityIcons name="instagram" size={22} color="#762e1f" />
              <Text className="ml-3 font-sans text-text">@cafecose.mtl</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
