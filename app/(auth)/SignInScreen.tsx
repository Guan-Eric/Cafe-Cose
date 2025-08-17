import { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { logIn } from '../../backend/auth';
import BackButton from '../../components/BackButton';
import AppleSignInButton from '../../components/AppleSignInButton';

function SignInScreen() {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const signIn = async () => {
    try {
      setLoading(true);
      setEmailError('');
      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email.');
        setLoading(false);
        return;
      }
      if (await logIn(email, password)) setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleAppleSignInSuccess = () => {
    // Navigate to main app after successful Apple sign-in
    router.replace('/(tabs)/(home)/HomeScreen');
  };

  const handleAppleSignInError = (error: Error) => {
    console.error('Apple Sign-In error:', error);
    // Handle error if needed
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-background">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <SafeAreaView className="flex-1">
            <BackButton />
            <View className="flex-1 items-center justify-center">
              <View className="items-center pb-[60px]">
                <Image
                  className="h-[100px] w-[250px] self-center"
                  resizeMode="contain"
                  source={require('../../assets/logo.png')}
                />
                <Text className="self-center font-sans text-4xl text-text">Sign In</Text>
              </View>

              <View className="pb-[30px]">
                <View className="h-[60px] w-[254px]">
                  <Text className="font-sans text-text">E-mail</Text>
                  <TextInput
                    className="text-m bg-input mt-2 flex-1 rounded-[10px] px-[10px] font-sans text-text"
                    placeholder="e.g. johnsmith@email.com"
                    value={email}
                    onChangeText={onChangeEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="gray"
                  />
                  {emailError ? <Text className="text-xs text-red-500">{emailError}</Text> : null}
                </View>

                <View className="mt-10 h-[60px] w-[254px]">
                  <Text className="font-sans text-text">Password</Text>
                  <TextInput
                    className="text-m bg-input mt-2 flex-1 rounded-[10px] px-[10px] font-sans text-text"
                    value={password}
                    onChangeText={onChangePassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="gray"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={signIn}
                disabled={loading}
                className="mb-4 h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-primary">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-sans text-white">Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Apple Sign-In Button */}
              <AppleSignInButton
                onSuccess={handleAppleSignInSuccess}
                onError={handleAppleSignInError}
                style="WHITE_OUTLINE"
                type="SIGN_IN"
              />

              <View className="items-center pt-5">
                <Text className="font-sans text-base text-gray-500">Don't have an account?</Text>
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/SignUpScreen')}
                  className="h-[42px] w-[100px] items-center justify-center">
                  <Text className="font-sans text-base text-primary">Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default SignInScreen;
