import { View, Text, SafeAreaView, Pressable, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { logOut } from '../../../backend/auth';

function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-2">
          <Text className="text-2xl font-bold text-text">Admin</Text>
          <TouchableOpacity
            className="mr-2 rounded-full bg-primary px-4 py-2"
            onPress={() =>
              router.replace({
                pathname: `/(tabs)/(home)/HomeScreen`,
              })
            }>
            <Text className="text-lg font-semibold text-secondaryText">Client View</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => logOut()} className="rounded-full bg-red-500 px-4 py-2">
            <Text className="text-lg font-semibold text-secondaryText">Logout</Text>
          </TouchableOpacity>
        </View>
        <View className="px-4">
          <View className="py-4">
            <Text className="text-xl font-semibold text-text">Café Cosé</Text>
          </View>
          <View className="gap-4 px-4 py-2">
            <TouchableOpacity
              onPress={() => router.push('/(admin)/(home)/QRScannerScreen')}
              className="flex-row items-center justify-center rounded-full bg-green-500 px-4 py-4">
              <Text className="mr-2 self-center text-lg font-[Lato_400Regular] text-secondaryText">
                Scan QR Code
              </Text>
              <MaterialCommunityIcons name="camera" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(admin)/(home)/PromotionScreen')}
              className="flex-row items-center justify-center rounded-full bg-blue-500 px-4 py-4">
              <Text className="mr-2 self-center text-lg font-[Lato_400Regular] text-secondaryText">
                View Promotion
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(admin)/(home)/FeedbackScreen')}
              className="flex-row items-center justify-center rounded-full bg-gray-500 px-4 py-4">
              <Text className="mr-2 self-center text-lg font-[Lato_400Regular] text-secondaryText">
                View Feedback
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;
