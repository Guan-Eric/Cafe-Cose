import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { logOut } from '../../../backend/auth';

function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#181818]">
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-2">
          <Text className="text-2xl font-bold text-white">Home</Text>
          <Pressable onPress={() => logOut()} className="rounded-lg bg-red-500 px-4 py-2">
            <Text className="text-white">Logout</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-4">
          <View className="py-4">
            <Text className="text-xl font-semibold text-white">Welcome to Coffee App</Text>
            <Text className="mt-2 text-gray-400">Your personal coffee companion</Text>
          </View>

          <View className="mt-4">
            <Text className="text-lg font-semibold text-white">Recent Orders</Text>
            <View className="mt-2 rounded-lg bg-[#1f1f1f] p-4">
              <Text className="text-gray-400">No recent orders</Text>
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-lg font-semibold text-white">Favorite Drinks</Text>
            <View className="mt-2 rounded-lg bg-[#1f1f1f] p-4">
              <Text className="text-gray-400">No favorite drinks yet</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;
