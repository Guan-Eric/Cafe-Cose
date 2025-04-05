import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { logOut } from '../../../backend/auth';
import LoyaltyCard from '../../../components/cards/LoyaltyCard';
import MenuCard from '../../../components/cards/MenuCard';

function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-2">
          <Text className="text-2xl font-bold text-text">Home</Text>
          <Pressable onPress={() => logOut()} className="rounded-lg bg-red-500 px-4 py-2">
            <Text className="text-text">Logout</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-4">
          <View className="py-4">
            <Text className="text-xl font-semibold text-text">Welcome to Café Cosé</Text>
            <Text className="mt-2 text-gray-400">Pointe-Saint-Charles</Text>
          </View>

          <LoyaltyCard points={5} onPress={() => console.log('Loyalty card pressed')} />

          <View className="mt-2">
            <Text className="text-lg font-semibold text-text">Menu</Text>
            <View className="mt-2">
              <MenuCard
                title="Cappuccino"
                description="Espresso with steamed milk foam"
                price={4.5}
                imageUrl="https://example.com/cappuccino.jpg"
                onPress={() => console.log('Menu item pressed')}
              />
              <MenuCard
                title="Latte"
                description="Espresso with steamed milk and a light layer of milk foam"
                price={4.75}
                imageUrl="https://example.com/latte.jpg"
                onPress={() => console.log('Menu item pressed')}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;
