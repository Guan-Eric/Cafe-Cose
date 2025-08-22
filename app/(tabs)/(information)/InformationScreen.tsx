import React, { useEffect, useState } from 'react';
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
import { getOpeningHours } from 'backend/hours';
import { Hours } from 'components/types';

const cafeAddress = '1883 Centre St, Montreal, Quebec H3K 1J1';

export default function InformationScreen() {
  const handleOpenMaps = () => {
    const url = `https://maps.app.goo.gl/xvGsoTxq62vBFZ4Y7`;
    Linking.openURL(url);
  };

  const [hours, setHours] = useState<Hours | null>();

  useEffect(() => {
    const fetchOpeningHours = async () => {
      setHours(await getOpeningHours());
    };

    fetchOpeningHours();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="absolute left-0 right-0 top-0 h-[235px] bg-primary" />
      <Text className="mb-3 pl-8 font-sans text-3xl text-offwhite">Our Location</Text>
      <View className="mb-4 px-6">
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
      <ScrollView>
        <Text className="mb-3 mt-2 pl-4 font-sans text-2xl text-primary">Opening Hours</Text>
        <View className="mb-2 rounded-lg px-6">
          {hours?.defaultHours &&
            (
              [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ] as Array<keyof typeof hours.defaultHours>
            ).map((day) => {
              const { open, close } = hours.defaultHours[day as keyof typeof hours.defaultHours];
              return (
                <View key={day} className="w-full flex-row items-center py-1">
                  <Text className="flex-1 font-sans text-text">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Text>
                  <View className="mx-6 h-px flex-1 bg-primary" />
                  <Text className="text-right font-sans text-text">{`${open} - ${close}`}</Text>
                </View>
              );
            })}
        </View>
        {hours?.holiday && hours.holiday.length > 0 && (
          <>
            <Text className="mb-3 mt-2 pl-4 font-sans text-2xl text-primary">Holidays</Text>
            <View className="mb-2 rounded-lg px-6">
              {hours.holiday.map((holiday, index) => (
                <View key={index} className="w-full flex-row items-center py-1">
                  <Text className="flex-1 font-sans text-text">
                    {holiday.name != ''
                      ? holiday.name
                      : holiday.date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        })}
                  </Text>
                  <View className="mx-6 h-px flex-1 bg-primary" />
                  <Text
                    className={`text-right font-sans text-text ${!holiday.open && !holiday.close ? 'mx-[34px]' : ''}`}>
                    {holiday.open && holiday.close
                      ? `${holiday.open} - ${holiday.close}`
                      : 'CLOSED'}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

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
              className="mb-4 flex-row items-center"
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
