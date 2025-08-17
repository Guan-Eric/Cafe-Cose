import { SafeAreaView, View, Image, Text, Pressable, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AppleSignInButton from '../../components/AppleSignInButton';

function WelcomeScreen() {
  const handleAppleSignInSuccess = () => {
    // Navigate to main app after successful Apple sign-in
    router.replace('/(tabs)/(home)/HomeScreen');
  };

  const handleAppleSignInError = (error: Error) => {
    console.error('Apple Sign-In error:', error);
    // Handle error if needed
  };

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
        <View className="items-center">
          <Pressable
            onPress={() => router.push('/(auth)/SignUpScreen')}
            className="mb-4 h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-primary">
            <Text className="font-sans text-lg text-offwhite">Sign Up</Text>
          </Pressable>

          {/* Apple Sign-In Button */}
          <AppleSignInButton
            onSuccess={handleAppleSignInSuccess}
            onError={handleAppleSignInError}
            style="WHITE_OUTLINE"
            type="CONTINUE"
          />

          <View className="items-center pt-10">
            <Text className="font-sans text-sm text-gray-500">Already have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/SignInScreen')}
              className="h-[46px] w-[100px] items-center justify-center">
              <Text className="font-sans text-sm text-primary">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default WelcomeScreen;
