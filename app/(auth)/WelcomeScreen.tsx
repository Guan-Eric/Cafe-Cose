import { SafeAreaView, View, Image, Text, Pressable, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

function WelcomeScreen() {
  return (
    <View className="flex-1 items-center justify-around bg-background">
      <SafeAreaView className="flex-1 items-center justify-around">
        <View className="items-center">
          <Image
            className="h-[75px]"
            resizeMode="contain"
            source={require('../../assets/logo.png')}
          />
          <Image
            className="h-[150px]"
            resizeMode="contain"
            source={require('../../assets/cafe-cose.png')}
          />
        </View>
        <View>
          <Pressable
            onPress={() => router.push('/(auth)/SignUpScreen')}
            className="h-[46px] w-[200px] items-center justify-center rounded-[20px] bg-primary">
            <Text className="text-lg font-[Lato_400Regular] text-secondaryText">Sign Up</Text>
          </Pressable>

          <View className="items-center pt-10">
            <Text className="text-sm font-[Lato_400Regular] text-gray-500">
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/SignInScreen')}
              className="h-[46px] w-[100px] items-center justify-center">
              <Text className="text-sm font-[Lato_400Regular] text-primary">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default WelcomeScreen;
