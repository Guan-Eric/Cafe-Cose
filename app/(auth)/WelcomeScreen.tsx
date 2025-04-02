import { SafeAreaView, View, Image, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

function WelcomeScreen() {
  return (
    <View className="bg-background flex-1 items-center justify-around">
      <SafeAreaView className="flex-1 items-center justify-around">
        <View className="items-center">
          <Image
            className="h-[150px] w-[250px]"
            resizeMode="contain"
            source={require('../../assets/images/icon.png')}
          />
          <Image
            className="h-[150px] w-[250px]"
            resizeMode="contain"
            source={require('../../assets/cafe-cose.png')}
          />
        </View>

        <View>
          <Pressable
            onPress={() => router.push('/(auth)/SignUpScreen')}
            className="bg-primary h-[46px] w-[200px] items-center justify-center rounded-[20px]">
            <Text className="text-secondaryText text-lg font-[Lato_400Regular]">Sign Up</Text>
          </Pressable>

          <View className="items-center pt-10">
            <Text className="text-sm font-[Lato_400Regular] text-gray-500">
              Already have an account?
            </Text>

            <Pressable
              onPress={() => router.push('/(auth)/SignInScreen')}
              className="h-[46px] w-[100px] items-center justify-center">
              <Text className="text-primary text-sm font-[Lato_400Regular]">Sign In</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default WelcomeScreen;
