import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { logOut } from '../../../backend/auth';

function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-2">
          <Text className="text-2xl font-bold text-text">Admin</Text>
          <Pressable onPress={() => logOut()} className="rounded-lg bg-red-500 px-4 py-2">
            <Text className="text-text">Logout</Text>
          </Pressable>
        </View>
        <View className="px-4">
          <View className="py-4">
            <Text className="text-xl font-semibold text-text">Café Cosé</Text>
          </View>
          <View className="px-4 py-2">
            <Pressable
              onPress={() => router.push('/(admin)/(home)/QRScannerScreen')}
              className="rounded-lg bg-blue-500 px-4 py-2">
              <Text className="text-text">Scan QR Code</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;
